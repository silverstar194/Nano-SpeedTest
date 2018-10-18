from django.db import models


class Transaction(models.Model):
    TransactionId = models.TextField()
    SenderId = models.TextField()
    ReceiverId = models.TextField()
    StartTime = models.DateTimeField()
    EndTime = models.DateTimeField()
    Amount = models.FloatField()
    InitiatorIp = models.TextField()
