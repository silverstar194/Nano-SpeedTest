from django.conf import settings as settings

from .. import models as models


def new_account(wallet, address):
    account = models.Account(wallet=wallet, address=address)
    account.save()
    return account

def get_accounts():
    return models.Account.objects.all()

def get_account(address):
    try:
        return models.Account.objects.get(address=address)
    except models.Account.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        raise MultipleObjectsReturned()

def sync_accounts():
    pass
