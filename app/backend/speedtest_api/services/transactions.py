import logging
import random
import re
import time
import requests
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

    accounts_list_temp = get_accounts(in_use=False)

    accounts_list = []
    for account in accounts_list_temp:
        if account.POW:
            accounts_list.append(account)

    if len(accounts_list) == 0:
        logger.error("No accounts for origin.")
        raise NoAccountsException()

    origin = random.choice(accounts_list)

    account_destinations = []

    for account in accounts_list:
        if account.wallet.node.id != origin.wallet.node.id:
            account_destinations.append(account)

    if len(account_destinations) == 0:
        logger.error("No accounts for destination.")
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
        logger.error("No accounts for origin %s." % origin_node)
        raise NoAccountsException(origin_node)
    
    if len(destination_accounts_list) == 0:
        logger.error("No accounts for destination %s." % destination_node)
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
        logger.error("Cannot send negative amount %s." % amount)
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

    transaction.origin = get_account(transaction.origin.address)

    if not pre_validation_work == transaction.origin.POW:
        transaction.PoW_cached_send = False

    try:
        logger.info("Transaction for send block status before_send")
        account_info = rpc_origin_node.account_info(transaction.origin.address, representative=True)
        time_before = int(round(time.time() * 1000))
        # # After this call, the nano will leave the origin
        # transaction.transaction_hash_sending = rpc_origin_node.send(
        #     wallet=transaction.origin.wallet.wallet_id,
        #     source=transaction.origin.address,
        #     destination=transaction.destination.address,
        #     amount=int(transaction.amount),
        #     work=transaction.origin.POW,
        #     id=transaction.id
        # )

        ##Create and process block work around
        sent_done, hash_value = create_and_process(transaction, account_info, "send")
        if not sent_done:
            logger.error("Error in create and process send")
            raise nano.rpc.RPCException()

        time_after = int(round(time.time() * 1000))
        roundtrip_time = time_after - time_before

        # Start timing once block is published to node and account for time on trip back
        transaction.start_send_timestamp = int(round(time.time() * 1000)) - (roundtrip_time * .75)

        logger.info("Transaction in status send to node %s " % transaction.transaction_hash_sending )
        transaction.POW_send = transaction.origin.POW

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

    try:
        logger.info("Transaction for receive block status before_send")
        time_transaction_send(transaction, hash_value)
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
    POWService.enqueue_account(address=transaction.origin.address, frontier=transaction.transaction_hash_sending)
    return transaction


def send_receive_block_async(transaction, rpc_destination_node):
    """
    Receive funds on managed account.

    @param transaction: Managed transaction
    """

    transaction.PoW_cached_send = True
    pre_validation_work = transaction.destination.POW
    if not validate_or_regenerate_PoW(transaction.destination):
        logger.error('Total failure of dPoW. Aborting transaction account %s' % transaction.destination.address)
        transaction.origin.unlock()
        transaction.destination.unlock()
        raise InvalidPOWException()

    transaction.destination = get_account(transaction.destination.address)

    if not pre_validation_work == transaction.destination.POW:
        transaction.PoW_cached_send = False

    try:
        logger.info("Transaction for receive block status before_receive")
        account_info = rpc_destination_node.account_info(transaction.destination.address, representative=True)
        time_before = int(round(time.time() * 1000))
        # transaction.transaction_hash_receiving = rpc_destination_node.receive(
        #     wallet=transaction.destination.wallet.wallet_id,
        #     account=transaction.destination.address,
        #     work=transaction.destination.POW,
        #     block=block_hash,
        # )

        ##Create and process block work around
        receive_done, hash_value = create_and_process(transaction, account_info, "receive")
        if not receive_done:
            logger.error("Error in create and process receive")
            raise nano.rpc.RPCException()

        time_after = int(round(time.time() * 1000))

        roundtrip_time = time_after - time_before
        transaction.start_receive_timestamp = int(round(time.time() * 1000)) - (roundtrip_time * .75)

        transaction.POW_receive = transaction.destination.POW
    except nano.rpc.RPCException as e:
        ##Unlock accounts
        logger.error("RPCException two %s" % e)

        transaction.origin.unlock()
        transaction.destination.unlock()

        transaction.destination.POW = None
        frontier = rpc_destination_node.frontiers(account=transaction.destination.address, count=1)[transaction.destination.address]
        POWService.enqueue_account(address=transaction.destination.address, frontier=frontier)

        raise nano.rpc.RPCException()

    # Handover control to the timing service (expecting the timestamp to be set on return)
    try:
        time_transaction_receive(transaction, hash_value)
    except Exception as e:
        ##Unlock accounts
        transaction.origin.unlock()
        transaction.destination.unlock()
        logger.exception('Transaction timing_receive failed, transaction.id: %s, error: %s' % (str(transaction.id), str(e)))

    transaction.transaction_hash_receiving = hash_value
    transaction.destination.POW = None

    transaction.destination.save()
    transaction.save()
    POWService.enqueue_account(address=transaction.destination.address, frontier=transaction.transaction_hash_receiving)


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

        from_account.POW = None
        from_account.save()

        if generate_PoW:
            POWService.enqueue_account(address=from_account.address, frontier=transaction_hash_sending, urgent=True)

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
    return models.Transaction.objects.filter(end_send_timestamp__gt=(F('start_send_timestamp')+180)).select_related().order_by('-id')[:count]


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

def create_and_process(transaction, account_info, type):

    if not type == "receive" and not type == "send":
        return False

    if type == "send":
        node_url = transaction.origin.wallet.node.URL
        work = transaction.origin.POW
        wallet = transaction.origin.wallet.wallet_id
        account = transaction.origin.address
        link = transaction.destination.address
        amount = str(int(account_info['balance']) - int(transaction.amount))

    if type == "receive":
        node_url = transaction.destination.wallet.node.URL
        work = transaction.destination.POW
        wallet = transaction.destination.wallet.wallet_id
        account = transaction.destination.address

        link = None
        while not link:
            link = transaction.transaction_hash_sending
            transaction = get_transaction(transaction.id)
            time.sleep(.2)

        amount = str(int(account_info['balance']) + int(transaction.amount))

    headers = {
        'Content-Type': 'application/json',
    }

    data_create_block = {
        "action": "block_create",
        "type": "state",
        "previous": account_info['frontier'],
        "account": account,
        "representative": account_info['representative'],
        "balance": amount,
        "link": link,
        "wallet": wallet,
        "work": work,
        "id": str(transaction.id),
    }
    logger.info(data_create_block)

    sent_successful = False
    count = 0
    while not sent_successful and count < 5:
        try:
            response = requests.post(node_url, headers=headers, data=json.dumps(data_create_block))
        except Exception as E:
            logger.exception("create_and_proces_send had retry %s of 4" % (count))
            if count >= 4:
                return sent_successful

        if response.status_code == requests.codes.ok:
            sent_successful = True


    create_block_response = json.loads(response.text)
    block_for_proccessing = {
        "action": "process",
        "block": create_block_response['block']
    }

    sent_successful = False
    count = 0
    while not sent_successful and count < 5:

        try:
            response = requests.post(node_url, headers=headers, data=json.dumps(block_for_proccessing))
            response_json = json.loads(response.text)
            hash_value = response_json['hash']

            if type == "send":
                transaction.transaction_hash_sending = hash_value
                logger.info("Send hash %s", hash_value)

            if type == "receive":
                transaction.transaction_hash_receiving = hash_value
                logger.info("Receive hash %s", hash_value)

            transaction.save()
        except Exception as E:
            logger.exception("create_and_process_send had retry on process %s of 4" % (count))
            count += 1
            if count >= 4:
                return sent_successful

        if response.status_code == requests.codes.ok:
            sent_successful = True

    return sent_successful, hash_value