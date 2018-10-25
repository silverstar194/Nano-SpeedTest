from django.db import models

from .node import Node


class Wallet(models.Model):
    node = models.ForeignKey(Node, on_delete=models.PROTECT)
