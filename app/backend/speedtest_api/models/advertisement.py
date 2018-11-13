from django.db import models


class Advertisement(models.model):
    message = models.TextField()
    URL = models.URLField
