from django.db import models


class Advertisement(models.Model):
    description = models.TextField()
    URL = models.URLField(null=True, default=None)
    title = models.TextField()
    start_timestamp = models.BigIntegerField(null=True, default=None)
    end_timestamp = models.BigIntegerField(null=True, default=None)
    company = models.TextField()
    email = models.CharField(null=True, default=None, max_length=64)
    tokens = models.IntegerField(null=True, default=None)
    enabled = models.BooleanField(default=False)

    def __str__(self):
        return u'Title: %s\nDescription: %s\nCompany: %s' % (self.title, self.description, self.company)
