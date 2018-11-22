import logging

from django.apps import AppConfig
import nano


logger = logging.getLogger(__name__)

class SpeedtestApiConfig(AppConfig):
    name = 'speedtest_api'

    def ready(self):
        from .services.wallets import get_wallets, WalletNotFoundException
        from .services.accounts import get_accounts, sync_accounts
        from .services.nodes import NodeNotFoundException
        from .services.transactions import AddressDoesNotExistException, AccountBalanceMismatchException
        from .services._pow import POWService

        logger.info('Starting POWService and running POW_accounts()...')
        POWService.start()
        POWService.POW_accounts()

        logger.info('Syncing account balances...')
        sync_accounts()

        #Current state validator that fixes changes between Nano and our DB
        logger.info('Starting node, wallet and account validation...')

        # Check to see if the node contains the wallets
        enabled_wallets = get_wallets()
        for wallet in enabled_wallets:
            try:
                rpc_node = nano.rpc.Client(wallet.node.URL)
            except Exception:
                logger.error('Node %s not found.' % wallet.node.URL)
                raise NodeNotFoundException(wallet.node)

            if not rpc_node.wallet_key_valid(wallet=wallet.wallet_id):
                logger.error('Wallet %s not found on node %s' % (wallet.wallet_id, wallet.node.URL))
                raise WalletNotFoundException(wallet)

        # Check to see if the accounts are contained in the wallets
        enabled_accounts = get_accounts()
        for account in enabled_accounts:
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
                logger.error('Account %s has pending transactions' % (account.address))

            if not balance == account.current_balance:
                logger.error('Account %s has mismatched balence' % (account.address))
                raise AccountBalanceMismatchException(balance, account.current_balance, account.address)
