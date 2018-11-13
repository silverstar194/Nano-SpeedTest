from django.db import models

from .wallet import Wallet


class Account(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.PROTECT)
    address = models.CharField(max_length=64)
    current_balance = models.DecimalField(default=0, decimal_places=0, max_digits=38)  # Measured in RAW
    POW = models.CharField(max_length=16, null=True)

    def __str__(self):
        return u'%s' % (self.address)
