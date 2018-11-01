from django.db import models

from .account import Account


class Transaction(models.Model):
    origin = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='origin')
    destination = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='destination')
    start_send_timestamp = models.DateTimeField(null=True, blank=True)
    end_send_timestamp = models.DateTimeField(null=True, blank=True)
    start_receive_timestamp = models.DateTimeField(null=True, blank=True)
    end_receive_timestamp = models.DateTimeField(null=True, blank=True)
    amount = models.IntegerField()  # Measured in RAW
    initiated_by = models.GenericIPAddressField(protocol='both')
    transaction_hash_sending = models.CharField(max_length=64)
    transaction_hash_receiving = models.CharField(max_length=64)

