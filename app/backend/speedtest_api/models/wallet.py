from django.db import models

from .node import Node


class Wallet(models.Model):
    node = models.ForeignKey(Node, on_delete=models.PROTECT)
    wallet_id = models.CharField(max_length=64)
