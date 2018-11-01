from django.apps import AppConfig


class SpeedtestApiConfig(AppConfig):
    name = 'speedtest_api'

    def ready(self):
        from .services._pow import POWService
        POWService.start()

        # TODO: Add a current state validator that fixes changes between Nano and our DB
        # Check to see if the node contains the wallets
        # Check to see if the accounts are contained in the wallets
        # Check to see if POW is valid
        # Check to see if balance is valid
