from django.db import models

from .account import Account


class Transaction(models.Model):
    origin = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='origin')
    destination = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='destination')
    start_send_timestamp = models.DateTimeField(null=True, blank=True)
    end_send_timestamp = models.DateTimeField(null=True, blank=True)
    start_receive_timestamp = models.DateTimeField(null=True, blank=True)
    end_receive_timestamp = models.DateTimeField(null=True, blank=True)
    amount = models.DecimalField(default=0, decimal_places=0, max_digits=38)  # Measured in RAW
    initiated_by = models.GenericIPAddressField(protocol='both')
    transaction_hash_sending = models.CharField(max_length=64)
    transaction_hash_receiving = models.CharField(max_length=64)

    def __str__(self):
        return u'Amount: %s\nOrigin: %s\nDestination: %s\nOrigin Hash: %s\nDestination Hash: %s' % (self.amount, self.origin.address, self.destination.address, self.transaction_hash_sending, self.transaction_hash_receiving)
