import time

from django.core.management.base import BaseCommand, CommandError
import nano

from ...models import *
from ...services import *
from ...services._pow import POWService


class PopulationException(Exception):
    def __init__(self):
        Exception.__init__(self, "Error occurred in the node population process.")

class Command(BaseCommand):
    def handle(self, *args, **options):
        """
        Generate a new wallet for every node and add 5 accounts to it.
        These new accounts are unopened and require balance_accounts to be run in order to give them nano.
        POW is also generated on these accounts but will not be able to at this time due to them being unopened (no open block).
        """

        nodes_list = nodes.get_nodes()

        for node in nodes_list:
            wallet = wallets.new_wallet(node=node)

            for i in range(5):
                accounts.new_account(wallet=wallet)
            
        POWService.POW_accounts()
        
        # TODO: Pick one new account and pause the script after printing for the user to transfer money in
        # TODO: account_balance should run to distribute the new accounts after all accounts are queued for POW
