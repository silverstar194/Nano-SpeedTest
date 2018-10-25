from django.db import models


class Node(models.Model):
    IP = models.GenericIPAddressField(protocol='both')
