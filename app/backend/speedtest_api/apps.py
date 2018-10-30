from django.apps import AppConfig


class SpeedtestApiConfig(AppConfig):
    name = 'speedtest_api'

    def ready(self):
        from .services._pow import POWService
        POWService.start()
