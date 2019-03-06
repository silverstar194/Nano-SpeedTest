from django.core.management.base import BaseCommand, CommandError

from ...models.account import Account
from ...services.nodes import get_nodes
from ...services.wallets import new_wallet, get_wallets
from ...services._pow import POWService
from ...services.accounts import sync_accounts, get_accounts, new_account, get_account
from ...services.transactions import simple_send
from django.conf import settings as settings

import nano
import time
import requests
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
        NOTE: This script is buggy and needs monitoring.
        """
        number_accounts_per_node = 150

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
                print("Created %s" % (new_account(wallet=wallet)))

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
            time.sleep(5)


        rpc = nano.rpc.Client(funding_account.wallet.node.URL)
        for i in range(6):
            try:
                frontier = rpc.frontiers(account=funding_account.address, count=1)[funding_account.address]
                if funding_account.POW is None or not rpc.work_validate(work=funding_account.POW, hash=frontier):
                    print("Generating PoW account %s " % (funding_account.address))

                    data = {
                     'hash': str(frontier),
                     'key': settings.DPOW_API_KEY
                    }

                    res = requests.post(url=settings.DPOW_ENDPOINT, json=data, timeout=15)
                    funding_account.POW = res.json()['work']
                    funding_account.save()
                    break
            except Exception:
                if i == 5:
                    print('dPoW failure account %s unlocked without PoW' % funding_account.address)
                    funding_account.unlock()

            while not funding_account.POW:
                funding_account = Account.objects.get(address=funding_account.address)
                time.sleep(1)

        empty_accounts = Account.objects.filter(current_balance=0).all()

        #Distribute funds between accounts to open them
        amount = funding_account.current_balance / len(empty_accounts[:])

        random.shuffle(all_accounts) # spread opening load across nodes
        print("Accounts empty %s " % (len(empty_accounts[:])))
        for account_init in all_accounts:
            # Already opened
            if account_init.current_balance > 0:
                print("Skipping")
                continue
            try:
                frontier = rpc.frontiers(account=funding_account.address, count=1)[funding_account.address]
                if funding_account.POW is None or not rpc.work_validate(work=funding_account.POW, hash=frontier):

                    data = {
                     'hash': str(frontier),
                     'key': settings.DPOW_API_KEY
                    }

                    res = requests.post(url=settings.DPOW_ENDPOINT, json=data, timeout=15)
                    funding_account.POW = res.json()['work']
                    funding_account.save()
            except Exception:
                if i == 5:
                    print('dPoW failure account %s unlocked without PoW' % funding_account.address)
                    funding_account.unlock()
            count = 0
            while not funding_account.POW and count < 5:
                funding_account = Account.objects.get(address=funding_account.address)
                count += 1
                time.sleep(1)

            simple_send(funding_account, account_init.address, int(amount), generate_PoW=False) ##Using send simple allows node to generate open block for us
