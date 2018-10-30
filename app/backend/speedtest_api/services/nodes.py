from django.conf import settings as settings

from .. import models as models


def new_node(ip):
    node = models.Node(IP=ip)
    node.save()
    return node

def get_nodes():
    return models.Node.objects.all()

def get_node(id):
    try:
        return models.Node.objects.get(id=id)
    except models.Node.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        raise MultipleObjectsReturned()
