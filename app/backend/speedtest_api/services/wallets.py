from django.conf import settings as settings

from .. import models as models


def new_wallet(node):
    wallet = models.Wallet(node=node.id)
    wallet.save()
    return wallet

def get_wallets():
    return models.Wallet.objects.all()

def get_wallet(id):
    try:
        return models.Wallet.objects.get(id=id)
    except models.Wallet.DoesNotExist:
        return None