from django.core.management.base import BaseCommand, CommandError

from ...models.account import Account

import time


class Command(BaseCommand):

    help = "Generate a new wallet for every node, add accounts and distribute funds"

    def handle(self, *args, **options):
        """
        List stats about account health
        """
        print("Total Accounts", Account.objects.count())
        print("Accounts without PoW", Account.objects.filter(POW=None).filter(in_use=True).count())