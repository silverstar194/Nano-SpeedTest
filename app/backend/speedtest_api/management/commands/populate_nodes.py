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
        nodes_list = nodes.get_nodes()

        for node in nodes_list:
            rpc = nano.rpc.Client(node.IP)
            wallet_id = rpc.wallet_create()

            wallet = wallets.new_wallet(node=node, wallet_id=wallet_id)

            for i in range(5):
                accounts.new_account(wallet=wallet)
            
        POWService.POW_accounts()
        
        # TODO: Pick one new account and pause the script after printing for the user to transfer money in
        # TODO: account_balance should run to distribute the new accounts after all accounts are queued for POW
