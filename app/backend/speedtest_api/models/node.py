from django.db import models


class Node(models.Model):
    URL = models.CharField(max_length=512)
    latitude = models.DecimalField(decimal_places=6, max_digits=10)
    longitude = models.DecimalField(decimal_places=6, max_digits=10)
    location_name = models.CharField(max_length=256, default=None)
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return u'%s' % (self.URL)
