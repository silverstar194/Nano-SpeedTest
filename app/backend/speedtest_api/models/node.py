from django.db import models


class Node(models.Model):
    IP = models.GenericIPAddressField(protocol='both')

    def __str__(self):
        return u'%s' % (self.IP)
