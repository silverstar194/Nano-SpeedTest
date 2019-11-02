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
        accounts = Account.objects.all()
        for account in accounts:
            if account.POW:
                print(account.POW)
                print(self.to_multiplier(int(account.POW, 16), int("0xffffffc000000000", 16)))
            elif not account.POW:
                print("POW None")
            else:
                raise Exception("POW below threshold %s", account.POW)

    def to_multiplier(self, difficulty: int, base_difficulty) -> float:
        return float((1 << 64) - base_difficulty) / float((1 << 64) - difficulty)

    def from_multiplier(self, multiplier: float, base_difficulty) -> int:
        return int((1 << 64) - ((1 << 64) - base_difficulty) / multiplier)