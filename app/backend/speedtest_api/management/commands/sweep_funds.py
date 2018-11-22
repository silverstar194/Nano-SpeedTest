import logging

from django.core.management.base import BaseCommand, CommandError
import nano

from ...services.nodes import get_nodes
from ...services.accounts import get_accounts
from ...services._pow import POWService
from ...services.transactions import simple_send


class SweepException(Exception):
    def __init__(self, s):
        Exception.__init__(self, "Error occurred in the account sweeping process. "+s)

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Move all funds across nodes to external address'

    def add_arguments(self, parser):
        parser.add_argument('output_address', type=str, help='Address to sweep funds into')

    def handle(self, *args, **options):
        """
        Move all funds across nodes (from all wallets and accounts) into an external account. This is used to clean up setup and recover nano.
        """
        out_address = options['output_address']
        accounts_list = get_accounts()

        if out_address in [x.address for x in accounts_list]:
            raise SweepException("Output address on node(s) already.")

        ##Move funds to out_address
        i = 0
        for account in accounts_list:
            i+=1
            logger.info("%s of %s %s -> %s" % (i, len(accounts_list), account.address, out_address))
            simple_send(account, out_address, account.current_balance)

        ##Disable nodes
        all_enabled_nodes = get_nodes()
        for node in all_enabled_nodes:
            node.enabled = False
            node.save()






