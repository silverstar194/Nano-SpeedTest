from django.db import models

from .wallet import Wallet


class Account(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.PROTECT)
    address = models.CharField(max_length=64)
    current_balance = models.IntegerField(default=0)  # Measured in RAW
    POW = models.CharField(max_length=16)

