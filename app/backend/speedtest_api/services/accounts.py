import logging
from multiprocessing.pool import ThreadPool

from django.conf import settings as settings
import nano

from .. import models as models


logger = logging.getLogger(__name__)


class AccountNotFound(Exception):
    def __init__(self, account, node):
        Exception.__init__(self, "{0} not found on {1}".format(account, node))


def new_account(wallet, address=None):
    """
    Create a new account on the database and possibly node if address is None

    @param address: Address of the wallet to add (if None, will generate a new address in the wallet)
    @param wallet: Wallet of the account
    @return: New account object
    @raise RPCException: RPC Failure
    """

    rpc = nano.rpc.Client(wallet.node.URL)

    if address is None:
        address = rpc.account_create(wallet=wallet.wallet_id)

        try:
            # This won't work due to a source block being required for an open block?
            # If it doesn't work, send something to the new block
            rpc.process(block=rpc.block_create(type='open', account=address, wallet=wallet.wallet_id))
        except:
            pass

    if not rpc.validate_account_number(account=address):
        raise AccountNotFound()

    return models.Account.objects.create(wallet=wallet, address=address)

def get_accounts(enabled=True, node=None, in_use=None):
    """
    Get all accounts in the database

    @param enabled: Filter based on account's wallet's node enability
    @param node: Filter based on accounts belonging to the node (precendence) 
    @return: Query of all accounts (filtered by enabled or node)
    """
    if in_use is not None and node:
        return models.Account.objects.filter(wallet__node__id=node.id).filter(in_use=in_use)

    if in_use is not None:
        return models.Account.objects.filter(wallet__node__enabled=enabled).filter(in_use=in_use)

    if node:
        return models.Account.objects.filter(wallet__node__id=node.id)

    return models.Account.objects.filter(wallet__node__enabled=enabled)

def get_account(address):
    """
    Get an account in the database with the specified address

    @param address: The account returned will have this address
    @return: None if there is no account with that address or an Account object
    @raise MultipleObjectsReturned: If more than one account has the address given, this will be raised
    """

    try:
        return models.Account.objects.get(address=address)
    except models.Account.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        raise MultipleObjectsReturned()

def sync_accounts():
    """
    Sync all the account balances with the nano network. If there is a difference, the account's POW will also be reset

    @raise RPCException: RPC Failure
    """

    accounts_list = get_accounts()

    thread_pool = ThreadPool(processes=5)
    for account in accounts_list:
        thread_pool.apply_async(check_account_async, (account,))
    thread_pool.close()


def check_account_async(account):
    rpc = nano.rpc.Client(account.wallet.node.URL)

    try:
        rpc.search_pending_all()
        incoming_blocks = rpc.pending(account=account.address)
        for block_hash in incoming_blocks:
            rpc.receive(wallet=account.wallet.wallet_id, account=account.address, block=block_hash)
            account.POW = None
            account.save()
            logger.warning('Received block: %s' % block_hash)
    except Exception as e:
        logger.error('Error trying to receive blocks (for %s): %s' % (account.address, e))

    new_balance = rpc.account_balance(account=account.address)['balance']

    if new_balance != account.current_balance:
        account.current_balance = new_balance

        # We reset the POW because if there is an issue here, that means the POW must have been changed
        account.POW = None

    account.unlock()