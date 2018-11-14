from django.db import models


class Advertisement(models.Model):
    message = models.TextField()
    URL = models.URLField
    title = models.TextField()
