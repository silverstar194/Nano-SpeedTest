import logging
import random
import re
import time
import threading
import nano
from decimal import *

from django.conf import settings as settings
from django.core.exceptions import MultipleObjectsReturned
from django.db.models import F


from .. import models as models
from .wallets import *
from .nodes import *
from .accounts import *
from ._pow import POWService
from ._nodetiming import *


logger = logging.getLogger(__name__)

class AccountBalanceMismatchException(Exception):
    def __init__(self, balance_actual, balance_db, account):
        Exception.__init__(self, "{0} != {1} for account: {2}".format(balance_actual, balance_db, account))

class InsufficientNanoException(Exception):
    def __init__(self):
        Exception.__init__(self, "The Nano account did not have enough RAW to make a transaction.")

class AddressDoesNotExistException(Exception):
    def __init__(self, account, wallet):
        Exception.__init__(self, "The Nano address {0} does not exist on wallet {1}".format(account, wallet))

class NoIncomingBlocksException(Exception):
    def __init__(self, account):
        Exception.__init__(self, "There were no incoming blocks to receive for the account: %s." % account)

class TooManyIncomingBlocksException(Exception):
    def __init__(self, account):
        Exception.__init__(self, "There were more than one incoming blocks for the account: %s." % account)

class InvalidPOWException(Exception):
    def __init__(self):
        Exception.__init__(self, "The POW on the account was not valid.")

class NoAccountsException(Exception):
    def __init__(self, node='NA'):
        Exception.__init__(self, "The specified node (%s) does not have any accounts." % node)


def new_transaction_random(batch):
    """
    Create a new transaction with random origin, destination, and amount fields.
    This does not execute the transaction on the nano network.

    @param batch: Batch this transaction is a part of
    @return: New transaction object
    """

    accounts_list = get_accounts(in_use=False)

    if len(accounts_list) == 0:
        logging.error("No accounts for origin.")
        raise NoAccountsException()

    origin = random.choice(accounts_list)

    account_destinations = []

    for account in accounts_list:
        if account.wallet.node.id != origin.wallet.node.id:
            account_destinations.append(account)

    if len(account_destinations) == 0:
        logging.error("No accounts for destination.")
        raise NoAccountsException()

    destination = random.choice(account_destinations)

    base_amount = 100000000000000000000
    amount = base_amount * Decimal(random.randint(1, 9))

    return new_transaction(origin_account=origin, destination_account=destination, amount=amount, batch=batch)

def new_transaction_nodes(origin_node, destination_node, batch):
    """
    Create a transaction from the given properties.

    @param origin_node: Node source
    @param destination_node: Node receiver
    @param batch: Batch of the new transaction
    @return: New transaction object
    """

    origin_accounts_list = get_accounts(node=origin_node, in_use=False)
    destination_accounts_list = get_accounts(node=destination_node, in_use=False)

    if len(origin_accounts_list) == 0:
        logging.error("No accounts for origin %s." % origin_node)
        raise NoAccountsException(origin_node)
    
    if len(destination_accounts_list) == 0:
        logging.error("No accounts for destination %s." % destination_node)
        raise NoAccountsException(destination_node)

    origin = random.choice(origin_accounts_list)

    if destination_accounts_list.filter(address=origin.address).exists():
        destination_accounts_list = destination_accounts_list.exclude(address=origin.address)

    destination = random.choice(destination_accounts_list)

    base_amount = 100000000000000000000
    amount = base_amount * Decimal(random.randint(1, 9))

    return new_transaction(origin_account=origin, destination_account=destination, amount=amount, batch=batch)

def new_transaction(origin_account, destination_account, amount, batch):
    """
    Create a transaction from the given properties.
    We must lock accounts on creation of transaction between them.

    @param origin_account: Account source
    @param destination_account: Account receiver
    @param amount: Amount in RAW to send
    @param batch: Batch of the transaction
    @return: New transaction object
    """

    if amount < 0:
        logging.error("Cannot send negative amount %s." % amount)
        raise ValueError("Amount sent must be positive.")

    ##Lock origin and destination accounts
    ##Unlock accounts
    origin_account.lock()
    destination_account.lock()

    transaction = models.Transaction(
        origin=origin_account,
        destination=destination_account,
        amount=amount,
        batch=batch
    )

    transaction.save()

    return transaction

def send_transaction(transaction):
    """
    Complete a transaction on the Nano network while timing results.
    We must unlock accounts on any failure or at completion of sending.

    @param transaction: Transaction to execute
    @return: Transaction object with new information
    @raise: RPCException: RPC Failure
    @raise: AccountBalanceMismatchException: Will prevent the execution of the current transaction but will also rebalance the account
    @raise: InsufficientNanoException: The origin account does not have enough funds
    @raise: InvalidPOWException: The origin account does not have valid POW
    @raise: NoIncomingBlocksException: Incoming block not found on destination node. This will lead to invalid POW and balance in the destination account if not handled
    @raise: TooManyIncomingBlocksException: Incoming block not found on destination node. This will lead to invalid POW and balance in the destination account if not handled
    """
    ##
    # Validation was removed to increase speed of response.
    ##
    # # Do some origin balance checking
    # origin_balance = rpc_origin_node.account_balance(account=transaction.origin.address)['balance']
    # if (origin_balance != transaction.origin.current_balance):
    #     transaction.origin.current_balance = origin_balance
    #     transaction.origin.save()
    #     transaction.save()
    #     logger.info("AccountBalanceMismatch %s" % transaction.origin.address)
    
    # # Make sure the wallet contains the account address
    # if (not rpc_origin_node.wallet_contains(wallet=transaction.origin.wallet.wallet_id, account=transaction.origin.address)):
    #     ##Unlock accounts
    #     transaction.origin.unlock()
    #     transaction.destination.unlock()
    #     logger.info("AddressDoesNotExistException %s" % transaction.origin.address)
    #     raise AddressDoesNotExistException(
    #         wallet=transaction.origin.wallet,
    #         account=transaction.origin.address
    #     )
    #
    # if (not rpc_destination_node.wallet_contains(wallet=transaction.destination.wallet.wallet_id, account=transaction.destination.address)):
    #     ##Unlock accounts
    #     transaction.origin.unlock()
    #     transaction.destination.unlock()
    #     logger.info("AddressDoesNotExistException %s" % transaction.destination.address)
    #     raise AddressDoesNotExistException(
    #         wallet=transaction.destination.wallet,
    #         account=transaction.destination.address
    #     )


    rpc_origin_node = nano.rpc.Client(transaction.origin.wallet.node.URL)
    rpc_destination_node = nano.rpc.Client(transaction.destination.wallet.node.URL)

    if (transaction.origin.current_balance - transaction.amount < 0):
        ##Unlock accounts
        transaction.origin.unlock()
        transaction.destination.unlock()
        logger.info("InsufficientNanoException %s" % transaction.origin.address)
        raise InsufficientNanoException()


    transaction.PoW_cached_send = True
    pre_validation_work = transaction.origin.POW

    if not validate_or_regenerate_PoW(transaction.origin):
        logger.error('Total faliure of dPoW. Aborting transaction account %s' % transaction.origin.address)
        transaction.origin.unlock()
        transaction.destination.unlock()
        raise InvalidPOWException()

    if not pre_validation_work == transaction.origin.POW:
        transaction.PoW_cached_send = False

    # Start the timestamp before we try to send out the request
    transaction.start_send_timestamp = int(round(time.time() * 1000))

    try:
        before_send = int(round(time.time() * 1000))
        # After this call, the nano will leave the origin
        transaction.transaction_hash_sending = rpc_origin_node.send(
            wallet=transaction.origin.wallet.wallet_id,
            source=transaction.origin.address,
            destination=transaction.destination.address,
            amount=int(transaction.amount),
            work=transaction.origin.POW,
            id=transaction.id
        )
        transaction.POW_send = transaction.origin.POW
        after_send = int(round(time.time() * 1000))


        # Sometimes the node hangs in response if it is busy computing a automatic receive block PoW.
        # This should not be counted towards transaction time.
        # Therefore we use typical response time as a correction factor.
        # This is recorded with transaction.
        # Author: silverstar194
        # 3/6/2019
        if before_send + 5000 < after_send:
            transaction.start_send_timestamp = after_send - 300
            transaction.node_send_bias = -300
            transaction.node_lag = after_send - before_send
            logger.error("LONG TIME NODE: Sent work %s block %s time %s" %(transaction.origin.POW, transaction.transaction_hash_sending, after_send - before_send))
            transaction.save()

        # Update the balances and POW
        transaction.origin.current_balance = transaction.origin.current_balance - transaction.amount
        transaction.destination.current_balance = transaction.destination.current_balance + transaction.amount
        transaction.origin.POW = None
    except nano.rpc.RPCException as e:
        logger.error("RPCException one %s" % e)
        ##Unlock accounts
        transaction.origin.unlock()
        transaction.destination.unlock()
        raise nano.rpc.RPCException()
    
    # Handover control to the timing service (expecting the timestamp to be set on return)
    try:
        time_transaction_send(transaction)
    except Exception as e:
        ##Unlock accounts
        transaction.origin.unlock()
        transaction.destination.unlock()
        logger.error('Transaction timing_send failed, transaction.id: %s, error: %s' % (str(transaction.id), str(e)))

    transaction.origin.save()
    transaction.destination.save()
    transaction.save()


    # Return as soon as transaction_hash_receiving is available
    # Finish work on 2nd thread
    t = threading.Thread(target=send_receive_block_async, args=(transaction, rpc_destination_node))
    t.start()

    #Regenerte PoW
    POWService.enqueue_account(address=transaction.origin.address, frontier=transaction.transaction_hash_sending, wait=True)
    return transaction


def send_receive_block_async(transaction, rpc_destination_node):
    """
    Receive funds on managed account.

    @param transaction: Managed transaction
    """

    block_hash = transaction.transaction_hash_sending

    transaction.PoW_cached_send = True
    pre_validation_work = transaction.destination.POW

    if not validate_or_regenerate_PoW(transaction.destination):
        logger.error('Total faliure of dPoW. Aborting transaction account %s' % transaction.destination.address)
        transaction.origin.unlock()
        transaction.destination.unlock()
        raise InvalidPOWException()

    if not pre_validation_work == transaction.destination.POW:
        transaction.PoW_cached_send = False

    transaction.start_receive_timestamp = int(round(time.time() * 1000))
    try:
        transaction.transaction_hash_receiving = rpc_destination_node.receive(
            wallet=transaction.destination.wallet.wallet_id,
            account=transaction.destination.address,
            work=transaction.destination.POW,
            block=block_hash,
        )
        transaction.POW_receive = transaction.destination.POW
        transaction.save()
    except nano.rpc.RPCException as e:
        ##Unlock accounts
        logger.error("RPCException two %s" % e)

        transaction.origin.unlock()
        transaction.destination.unlock()

        transaction.destination.POW = None
        frontier = rpc_destination_node.frontiers(account=transaction.destination.address, count=1)[transaction.destination.address]
        POWService.enqueue_account(address=transaction.destination.address, frontier=frontier, wait=True)

        raise nano.rpc.RPCException()

    # Handover control to the timing service (expecting the timestamp to be set on return)
    try:
        time_transaction_receive(transaction)
    except Exception as e:
        ##Unlock accounts
        transaction.origin.unlock()
        transaction.destination.unlock()
        logger.error('Transaction timing_receive failed, transaction.id: %s, error: %s' % (str(transaction.id), str(e)))

    ## Check node didn't return all "000000..."
    frontier = transaction.transaction_hash_receiving
    count = 0
    while re.match("^[0]+$", frontier) and count < 3:
        count += 1
        time.sleep(1) ## Allow frontier to clear in node
        logger.error('Node returned all zeros acccount: %s. try %s of 3' % (transaction.destination.address, count))
        frontier = rpc_destination_node.frontiers(account=transaction.destination.address, count=1)[transaction.destination.address]

    transaction.transaction_hash_receiving = frontier
    transaction.destination.POW = None

    transaction.destination.save()
    transaction.save()

    POWService.enqueue_account(address=transaction.destination.address, frontier=frontier, wait=True)


def simple_send(from_account, to_address, amount, generate_PoW=True):
    """
    Send funds from managed account to external/new account. ONLY send block will be generated and sent. No receive block or timing is handled.

    @param from_account: Managed account to send funds from
    @param to_address: Account to receive funds
    @param amount: nano to send in RAW
    @return: hash of send block
    """
    from_account.lock()
    transaction_hash_sending = None
    try:
        rpc_origin_node = nano.rpc.Client(from_account.wallet.node.URL)
        # No dPoW is used. PoW will be generated on nodes instead.
        transaction_hash_sending = rpc_origin_node.send(
            wallet=from_account.wallet.wallet_id,
            source=from_account.address,
            destination=to_address,
            amount=amount,
            work=from_account.POW
        )
        print(from_account.address, to_address, amount)

        from_account.POW = None
        from_account.save()

        if generate_PoW:
            POWService.enqueue_account(address=from_account.address, frontier=transaction_hash_sending)

            count = 0
            while not from_account.POW and count < 5: # Allows newly enqueued PoW to clear
                count += 1
                from_account = get_account(from_account.address)
                time.sleep(2)

        from_account.current_balance = from_account.current_balance - amount
        from_account.save()
    except Exception as e:
        logger.error("Error in simple_send account %s to account %s %s", from_account.address, to_address, str(e))

    from_account.unlock()

    return transaction_hash_sending


def get_transactions(enabled=True, batch=None, download=False):
    """
    Get all transactions in the database.

    @param enabled: Get transactions whose origin and destination node is enabled
    @param batch: If not None, only get transactions within a batch (precedence)
    @return: Query of all transactions
    """

    if batch is not None:
        return models.Transaction.objects.filter(batch__id=batch.id)

    if enabled:
        return models.Transaction.objects.filter(origin__wallet__node__enabled=enabled, destination__wallet__node__enabled=enabled)

    if download:
        return models.Transaction.objects.select_related().order_by('-id')[:]

    return models.Transaction.objects.all()


def get_recent_transactions(count=25):
    """
    Get most recent count transaction with enabled nodes

    @param count: Number of most recent transactions to return
    @return: Query of transactions
    """
    return models.Transaction.objects.filter(end_send_timestamp__gt=(F('start_send_timestamp')+150)).select_related().order_by('-id')[:count]


def get_transaction(id):
    """
    Get a transaction by id

    @param id: Id of the transaction to search for
    @return: None if not found or Transaction object
    @raise: MultipleObjectsReturned: If more than one object exists, this is raised
    """

    try:
        return models.Transaction.objects.get(id=id)
    except models.Transaction.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        raise MultipleObjectsReturned()