import logging

from django.apps import AppConfig


logger = logging.getLogger(__name__)

class SpeedtestApiConfig(AppConfig):
    name = 'speedtest_api'

    def ready(self):
        logger.info('Starting POWService and running POW_accounts()...')
        #from .services._pow import POWService
        #POWService.start()
        #POWService.POW_accounts()

        #logger.info('Syncing account balances...')
        #from .services import accounts
        #accounts.sync_accounts()

        # TODO: Add a current state validator that fixes changes between Nano and our DB
        # Check to see if the node contains the wallets
        # Check to see if the accounts are contained in the wallets
        # Check to see if balance is valid
