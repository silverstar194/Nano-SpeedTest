from django.db import models


class Node(models.Model):
    host = models.CharField(max_length=256)
