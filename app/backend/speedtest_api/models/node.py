from django.db import models


class Node(models.Model):
    IP = models.GenericIPAddressField(protocol='both')
    latitude = models.DecimalField(decimal_places=6, max_digits=8)
    longitude = models.DecimalField(decimal_places=6, max_digits=8)
