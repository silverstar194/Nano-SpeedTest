from django.db import models


class Batch(models.Model):
    initiated_by = models.GenericIPAddressField(protocol='both')
    createdAt = models.DateTimeField(auto_now=True)
