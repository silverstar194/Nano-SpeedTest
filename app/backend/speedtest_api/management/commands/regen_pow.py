import time

from django.core.management.base import BaseCommand, CommandError
import nano

from ...models import *
from ...services import *
from ...services._pow import POWService


class Command(BaseCommand):
    help = 'Get POW for all accounts'

    def handle(self, *args, **options):
        """
        Get POW for all accounts
        """

        POWService.POW_accounts(daemon=False)
