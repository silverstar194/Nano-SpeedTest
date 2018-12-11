import logging
import time
import requests

from django.core.management.base import BaseCommand, CommandError
from multiprocessing.pool import ThreadPool
import nano

from ...models import *
from ...services import *


logger = logging.getLogger(__name__)

class BalancingException(Exception):
    def __init__(self):
        Exception.__init__(self, "Error occurred in the balance process.")

class Command(BaseCommand):
    help = "Cleans up and validates database state"
    thread_pool = ThreadPool(processes=4)

    def handle(self, *args, **options):
        """
       Cleans up and validates database state

        """
        from ...services.accounts import get_accounts, sync_accounts
        from ...services._pow import POWService
        from ...services.wallets import get_wallets

        logger.info('Starting POWService and running POW_accounts() for clean up...')
        POWService.start()
        POWService.POW_accounts()

        logger.info('Syncing account balances...')
        sync_accounts()

        # Current state validator that fixes changes between Nano and our DB
        logger.info('Starting node, wallet and account validation for clean up...')

        # Check to see if the node contains the wallets
        enabled_wallets = get_wallets()
        self.thread_pool.apply_async(self.check_wallet_async, enabled_wallets)

        logger.info('Nodes and wallets validated for clean up...')

        # Check to see if the accounts are contained in the wallets
        enabled_accounts = get_accounts()
        self.thread_pool.apply_async(self.check_account_async, enabled_accounts)

        logger.info('Accounts validated for clean up...')
        logger.info('Balances validated for clean up...')
        self.thread_pool.close()
        self.thread_pool.join()

        # Clear locks on all accounts to cleanup any leaks at the DB layer
        # Issues may arise from parallelism is pending transactions are cleared.
        # The impact will quite low as the pending transaction would be to be immediately selected to reuse.
        for account in enabled_accounts:
            account.unlock()


    def check_wallet_async(self, wallet):
        '''
        Checks that wallet is in node

        @param wallet
        '''
        from ...services.nodes import NodeNotFoundException
        from ...services.wallets import WalletNotFoundException
        try:
            rpc_node = nano.rpc.Client(wallet.node.URL)
        except Exception:
            logger.error('Node %s not found.' % wallet.node.URL)
            raise NodeNotFoundException(wallet.node)

        if not rpc_node.wallet_key_valid(wallet=wallet.wallet_id):
            logger.error('Wallet %s not found on node %s' % (wallet.wallet_id, wallet.node.URL))
            raise WalletNotFoundException(wallet)

    def check_account_async(self, account):
        '''
        Checks account in wallet and balance

        @param account
        '''
        from ...services.transactions import AddressDoesNotExistException, AccountBalanceMismatchException
        wallet = account.wallet.wallet_id
        node = account.wallet.node.URL
        rpc_node = nano.rpc.Client(node)
        if not rpc_node.wallet_contains(wallet, account.address):
            logger.error('Account %s not found in wallet %s on node %s' % (account.address, wallet, node))
            raise AddressDoesNotExistException(account, account.wallet)

        # Check to see if balances are valid
        balances = rpc_node.account_balance(account.address)
        pending = balances['pending']
        balance = balances['balance']
        if not pending == 0:
            logger.info('Account %s has pending transactions' % (account.address))
            return

        if not balance == account.current_balance:
            logger.error('Account %s has mismatched balence' % (account.address))
            raise AccountBalanceMismatchException(balance, account.current_balance, account.address)