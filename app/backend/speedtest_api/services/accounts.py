from django.conf import settings as settings
import nano

from .. import models as models


class AccountNotFound(Exception):
    def __init__(self, account, node):
        Exception.__init__(self, "{0} not found on {1}".format(account, node))


def new_account(wallet, address=None):
    rpc = nano.rpc.Client(wallet.node.IP)

    if address is None:
        address = rpc.account_create(wallet=wallet.wallet_id)

        try:
            # This won't work due to a source block being required for an open block?
            # If it doesn't work, send something to the new block
            rpc.process(block=rpc.block_create(type='open', account=address, wallet=wallet.wallet_id))
        except:
            pass

    account = models.Account(wallet=wallet, address=address)

    if not rpc.validate_account_number(account=address):
        raise AccountNotFound()

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
    accounts_list = get_accounts()

    for account in accounts_list:
        rpc = nano.rpc.Client(account.wallet.node.IP)

        new_balance = rpc.account_balance(account=account.address)['balance']

        if new_balance != account.current_balance:
            account.current_balance = new_balance
            
            # We reset the POW because if there is an issue here, that means the POW must have been changed
            account.POW = None

            account.save()
