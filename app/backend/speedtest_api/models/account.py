from django.db import models

from .node import Node


class Account(models.Model):
    node = models.ForeignKey(Node, on_delete=models.PROTECT)
    current_balance = models.IntegerField()  # Measured in RAW
    POW = models.CharField(max_length=16)
