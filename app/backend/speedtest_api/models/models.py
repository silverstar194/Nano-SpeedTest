from django.db import models

class Transaction(models.Model):
    ID = models.TextField()
    SenderID = models.TextField()
    ReceiverID = models.TextField()
    StartTime = models.DateTimeField()
    EndTime = models.DateTimeField()
    Amount = models.FloatField()
    InitiatorIP = models.TextField()
