from django.core.management.base import BaseCommand, CommandError

from ...models import *
from ...services.nodes import get_nodes
from ...services.wallets import new_wallet
from ...services._pow import POW_accounts
from ...services.accounts import sync_accounts, get_accounts, new_account
from ...services.transactions import simple_send


class PopulationException(Exception):
    def __init__(self):
        Exception.__init__(self, "Error occurred in the node population process.")

class Command(BaseCommand):
    def handle(self, *args, **options):
        """
        Generate a new wallet for every node and add 5 accounts to it.
        These new accounts are unopened and require balance_accounts to be run in order to give them nano.
        POW is also generated on these accounts.
        Funds are then send to open the accounts.
        """
        number_accounts_per_node = 5

        nodes_list = get_nodes()
        for node in nodes_list:
            wallet = new_wallet(node=node)

            for i in range(number_accounts_per_node):
                new_account(wallet=wallet)

        all_accounts = get_accounts()
        funding_account = all_accounts[0]
        input("Please deposit funds to %s and press enter" % funding_account.address)

        sync_accounts()

        # Distribute funds between accounts to open them
        amount = funding_account.current_balance / (number_accounts_per_node * len(nodes_list))
        for account_init in all_accounts:

            # Already opened
            if account_init.current_balance > 0:
                continue
            simple_send(funding_account, account_init.address, int(amount)) ##Using send simple allows node to generate open block for us

        # Resync to acquire balances
        sync_accounts()
        POW_accounts()
