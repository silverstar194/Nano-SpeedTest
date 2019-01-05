from django.db import models


class Partner(models.Model):
    title = models.CharField(max_length=56, null=True)
    text = models.CharField(max_length=256, null=True)
    link = models.CharField(max_length=512, null=True)
    email = models.CharField(max_length=256, null=True)
    enabled = models.BooleanField(default=False)
    img = models.CharField(max_length=256, null=True)

    def __str__(self):
        return u'%s %s' % (self.title, self.text)
