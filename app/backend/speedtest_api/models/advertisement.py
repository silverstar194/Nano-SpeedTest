from django.db import models


class Advertisement(models.Model):
    message = models.TextField()
    URL = models.URLField
    title = models.TextField()
    start_timestamp = models.BigIntegerField(null=True, default=None)
    end_timestamp = models.BigIntegerField(null=True, default=None)
    company = models.TextField()
    tokens = models.IntegerField(null=True, default=None)
