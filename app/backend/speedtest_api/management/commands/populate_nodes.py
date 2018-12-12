from django.core.management.base import BaseCommand, CommandError

from ...models.account import Account
from ...services.nodes import get_nodes
from ...services.wallets import new_wallet, get_wallets
from ...services._pow import POWService
from ...services.accounts import sync_accounts, get_accounts, new_account
from ...services.transactions import simple_send

import nano
import sys
import time
import random

class PopulationException(Exception):
    def __init__(self):
        Exception.__init__(self, "Error occurred in the node population process.")

class Command(BaseCommand):
    help = "Generate a new wallet for every node, add accounts and distribute funds"

    def handle(self, *args, **options):
        """
        Generate a new wallet for every node and add 200 accounts to it.
        These new accounts are unopened and require balance_accounts to be run in order to give them nano.
        POW is also generated on these accounts.
        Funds are then send to open the accounts.
        """
        number_accounts_per_node = 200

        nodes_list = get_nodes()
        wallets_list = get_wallets()
        for node in nodes_list:
            wallet = None

            for wallet_check in wallets_list:
                if wallet_check.node.id == node.id:
                    wallet = wallet_check

            if wallet is None:
                wallet = new_wallet(node=node)

            for i in range(number_accounts_per_node):
                new_account(wallet=wallet)

        all_accounts = list(get_accounts())
        funding_account = all_accounts[0]
        input("Please deposit funds to %s and press enter" % funding_account.address)

        ## Init. PoW
        funding_account.POW = None
        funding_account.save()

        ## Wait for funds to clear
        while funding_account.current_balance == 0:
            sync_accounts()
            funding_account = Account.objects.filter(address=funding_account.address)[0]
            time.sleep(120)


        #PoW
        rpc = nano.rpc.Client(funding_account.wallet.node.URL)
        for i in range(6):
            try:
                frontier = rpc.frontiers(account=funding_account.address, count=1)[funding_account.address]
                if funding_account.POW is None or not rpc.work_validate(work=funding_account.POW, hash=frontier):
                    POWService.enqueue_account(address=funding_account.address, frontier=frontier)
                    break
            except Exception:
                if i == 5:
                    print('dPoW failure account %s unlocked without PoW' % funding_account.address)
                    funding_account.unlock()
                    sys.exit()

        while not funding_account.POW:
            funding_account = Account.objects.get(address=funding_account.address)
            time.sleep(7)

        empty_accounts = Account.objects.filter(current_balance=0).all()
        # Distribute funds between accounts to open them
        amount = funding_account.current_balance / len(empty_accounts[:])

        random.shuffle(all_accounts) # spread opening load across nodes
        for account_init in all_accounts:
            # Already opened
            if account_init.current_balance > 0:
                continue
            simple_send(funding_account, account_init.address, int(amount)) ##Using send simple allows node to generate open block for us

        ## Wait for everything to clear the network
        all_cleared = False
        count = 0
        while not all_cleared and count < 20:
            count+=1
            # Resync to acquire balances
            all_cleared = True
            sync_accounts()
            for account in get_accounts():
                if not account.current_balance == amount:
                    all_cleared = False
                    break
            time.sleep(10)


        if count == 20:
            print("Some transactions failed...")
            sys.exit()

        POWService.POW_accounts()
