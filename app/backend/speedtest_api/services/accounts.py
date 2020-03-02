import logging
import time
from multiprocessing.pool import ThreadPool

from django.core.exceptions import MultipleObjectsReturned
import nano

from .. import models as models
from ._pow import POWService
from ..common.retry import retry

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

    address_nano = address.replace("xrb", "nano")
    if address is None:
        address = retry(lambda: rpc.account_create(wallet=wallet.wallet_id))

        try:
            # This won't work due to a source block being required for an open block?
            # If it doesn't work, send something to the new block
            retry(lambda: rpc.process(block=rpc.block_create(type='open', account=address_nano, wallet=wallet.wallet_id)))
        except:
            pass

    if not retry(lambda: rpc.validate_account_number(account=address_nano)):
        raise AccountNotFound()

    return retry(lambda: models.Account.objects.create(wallet=wallet, address=address))


def get_accounts(enabled=True, node=None, in_use=None, empty=None):
    """
    Get all accounts in the database

    @param enabled: Filter based on account's wallet's node enability
    @param node: Filter based on accounts belonging to the node (precendence) 
    @return: Query of all accounts (filtered by enabled or node)
    """
    if in_use is not None and node:
        return retry(lambda: models.Account.objects.filter(wallet__node__id=node.id).filter(in_use=in_use).filter(current_balance__gt=0).select_related())

    if in_use is not None:
        return retry(lambda: models.Account.objects.filter(wallet__node__enabled=enabled).filter(in_use=in_use).filter(current_balance__gt=0).select_related())

    if node:
        return retry(lambda: models.Account.objects.filter(wallet__node__id=node.id).filter(current_balance__gt=0).select_related())

    if empty:
        return retry(lambda: models.Account.objects.filter(current_balance=0).select_related())

    return retry(lambda: models.Account.objects.filter(wallet__node__enabled=enabled).filter(current_balance__gt=0).select_related())


def get_account(address):
    """
    Get an account in the database with the specified address

    @param address: The account returned will have this address
    @return: None if there is no account with that address or an Account object
    @raise MultipleObjectsReturned: If more than one account has the address given, this will be raised
    """

    try:
        return retry(lambda: models.Account.objects.get(address=address))
    except models.Account.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        logger.info("MultipleObjectsReturned for account %s " % address)
        return retry(lambda: models.Account.objects.filter(address=address).first())


def get_accounts_ignore_lock():
    """
    Get an account in the database regardless of if its locked or not.
    TODO
    """

    accounts_list = retry(lambda: models.Account.objects.filter(wallet__node__enabled=True).filter(current_balance__gt=0).select_related())
    return accounts_list


def sync_accounts():
    """
    Sync all the account balances with the nano network. If there is a difference, the account's POW will also be reset

    @raise RPCException: RPC Failure
    """
    accounts_list = get_accounts() # Not great all threads will vaildate TODO

    thread_pool = ThreadPool(processes=4)
    for account in accounts_list:
        thread_pool.apply_async(check_account_balance_async, (account,))
    thread_pool.close()
    thread_pool.join()


def clear_receive_accounts():
    """
    Fetches all receive block with the nano network across accounts.

    @raise RPCException: RPC Failure
    """
    accounts_list = get_accounts() # Not great all threads will vaildate TODO

    thread_pool = ThreadPool(processes=4)
    for account in accounts_list:
        thread_pool.apply_async(clear_frontier_async, (account,))
    thread_pool.close()
    thread_pool.join()


def unlock_all_accounts():
    """
    Unlock all the account at once for speed at DB layer
    """
    retry(lambda: models.Account.objects.all().update(in_use=False))


def lock_all_accounts():
    """
    Lock all the account at once for speed at DB layer
    """
    retry(lambda: models.Account.objects.all().update(in_use=True))


def number_accounts():
    return retry(lambda: models.Account.objects.filter(wallet__node__enabled=True).count())


def clear_frontier_async(account):
    """
    Clears out any pending receive blocks node does not auto process.
    :param account:
    """
    logger.info('Clearing possible receive blocks from account %s' % account.address)

    pending_blocks = None
    try:
        rpc = nano.rpc.Client(account.wallet.node.URL)
        address_nano = account.address.replace("xrb", "nano")
        pending_blocks = retry(lambda: rpc.accounts_pending([account.address])[address_nano])
    except Exception as e:
        logger.exception('RCP call failed during receive %s' % str(e.message))

    for block in pending_blocks:
        logger.info("Found block %s to receive for %s " % (block, account.address))

        if not validate_or_regenerate_PoW(account):
            logger.error('Total faliure of dPoW. Aborting receive account %s' % account.address)
            continue

        if len(pending_blocks) > 1:
            time.sleep(1)  ## Allow frontier to refresh

        try:
            received_block = retry(lambda: rpc.receive(wallet=account.wallet.wallet_id, account=account.address, work=account.POW, block=block))
            logger.info('Received block %s to %s' % (received_block, account.address))
        except nano.rpc.RPCException as e:
            logger.exception('Error during clean up receive account %s block %s ' % (account.address, block, str(e)))


def validate_or_regenerate_PoW(account):
    """
    Check for valid PoW and regenerates if needed.
    :param account:
    :returns PoW valid on account
    """

    rpc = nano.rpc.Client(account.wallet.node.URL)
    valid_PoW = validate_PoW(account)

    # Make sure the POW is there (not in the POW regen queue) if not wait for it and its valid
    count = 0
    while not valid_PoW and count < 3:
        try:
            account.POW = None
            retry(lambda: account.save())
            address_nano = account.address.replace("xrb", "nano")
            frontier = retry(lambda: rpc.frontiers(account=account.address, count=1)[address_nano])
            POWService.enqueue_account(address=account.address, frontier=frontier, urgent=True)
            logger.info('Generating PoW during validate_PoW for: %s' % account.address)
            count += 1
        except Exception as e:
            count += 1
            if count >= 3:
                logger.error('Error adding address, frontier pair to POWService: %s' % e)

        wait_on_PoW = 0
        while not valid_PoW and wait_on_PoW < 7:
            wait_on_PoW += 1
            account = get_account(account.address)
            valid_PoW = validate_PoW(account)
            time.sleep(1)

    ##Still no dPoW....
    if not valid_PoW:
        logger.error('Total failure of dPoW. Aborting transaction account %s' % account.address)
        account.POW = None
        retry(lambda: account.save())

    return valid_PoW


def validate_PoW(account):
    """
    Check for valid PoW.
    :param account:
    :returns PoW valid on account
    """

    if not account.POW:
        logger.error('PoW empty %s' % account.POW)
        return False

    valid_PoW = False
    rpc = nano.rpc.Client(account.wallet.node.URL)
    try:
        address_nano = account.address.replace("xrb", "nano")
        frontier = retry(lambda: rpc.frontiers(account=account.address, count=1)[address_nano])
        valid_PoW = retry(lambda: rpc.work_validate(work=account.POW, hash=frontier))
    except Exception as e:
        logger.exception('PoW invalid during validate_PoW %s' % str(e))

    if not valid_PoW:
        logger.error('PoW invalid work %s frontier %s' % (account.POW, frontier))

    return valid_PoW


def check_account_balance_async(account):
    """
    Check for correct balance with node.
    :param account:
    :returns PoW valid on account
    """

    logger.info('Syncing account: %s' % account)
    rpc = retry(lambda: nano.rpc.Client(account.wallet.node.URL))
    address_nano = account.address.replace("xrb", "nano")
    new_balance = retry(lambda: rpc.account_balance(account=address_nano)['balance'])

    if not account.current_balance == new_balance:
        logger.error('Updating balance %s' % (account.address))
        account.current_balance = new_balance
        account.POW = None

    retry(lambda: account.save())
    account.unlock()


def clear_all_POW():
    """
    Clear all POW for regeneration
    :return:
    """
    qs = retry(lambda: models.Account.objects.all())
    retry(lambda: qs.update(POW=None))