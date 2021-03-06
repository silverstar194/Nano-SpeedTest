from django.conf import settings as settings
import nano

from .. import models as models


class WalletNotFoundException(Exception):
    def __init__(self, wallet):
        Exception.__init__(self, "Fatal error occurred occurred. Wallet %s not found on node %s" % (wallet.wallet_id, wallet.node.URL))

def new_wallet(node, wallet_id=None):
    """
    Create a new wallet from the given information

    @param node: Node the wallet lives on
    @param wallet_id: The seed of the wallet, if None generate a new wallet on the node
    @return: New wallet object
    """

    if wallet_id is None:
        rpc = nano.rpc.Client(node.URL)
        wallet_id = rpc.wallet_create()

    return models.Wallet.objects.create(node=node, wallet_id=wallet_id)

def get_wallets(enabled=True):
    """
    Get all wallets in the database

    @enabled: Filter based on wallet's node enability
    @return: Query of all wallets
    """

    return models.Wallet.objects.filter(node__enabled=enabled)

def get_wallet(id):
    """
    Get an wallet in the database with the specified id (not wallet seed)

    @param id: The wallets id
    @return: None if there is no wallet with that id or a Wallet object
    @raise MultipleObjectsReturned: If more than one wallet has the id given, this will be raised
    """

    try:
        return models.Wallet.objects.get(id=id)
    except models.Wallet.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        raise MultipleObjectsReturned()
