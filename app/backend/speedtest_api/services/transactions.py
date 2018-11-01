import logging
import requests
import time

from django.utils import timezone
from django.conf import settings as settings
import nano

from .. import models as models
from .wallets import *
from .nodes import *
from .accounts import *
from ._pow import POWService
from ._nodetiming import *


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


def new_transaction(initiated_by):
    # TODO: Select accounts and amount
    # Send 100000000000000000000 RAW
    pass
    # return new_transaction(origin_account, destination_account, amount, initiated_by)

def new_transaction(origin_account, destination_account, amount, initiated_by):
    transaction = models.Transaction(
        origin=origin_account,
        destination=destination_account,
        amount=amount,
        initiated_by=initiated_by
    )

    # TODO: Lock the accounts

    transaction.save()
    return transaction

def send_transaction(transaction):
    logger = logging.getLogger(__name__)

    rpc_origin_node = nano.rpc.Client(transaction.origin.wallet.node.IP)
    rpc_destination_node = nano.rpc.Client(transaction.destination.wallet.node.IP)

    # Do some origin balance checking
    origin_balance = rpc_origin_node.account_balance(account=transaction.origin.address)['balance']
    if (origin_balance != transaction.origin.current_balance):
        raise AccountBalanceMismatchException(
            balance_actual=origin_balance, 
            balance_db=transaction.origin.current_balance,
            account=transaction.origin.address
        )
    elif (origin_balance - transaction.amount <= 0):
        raise InsufficientNanoException()
    
    # Make sure the wallet contains the account address
    if (not rpc_origin_node.wallet_contains(wallet=transaction.origin.wallet.wallet_id, account=transaction.origin.address)):
        raise AddressDoesNotExistException(
            wallet=transaction.origin.wallet,
            account=transaction.origin.address
        )
    
    if (not rpc_destination_node.wallet_contains(wallet=transaction.destination.wallet.wallet_id, account=transaction.destination.address)):
        raise AddressDoesNotExistException(
            wallet=transaction.destination.wallet,
            account=transaction.destination.address
        )

    # Make sure the POW is there (not in the POW regen queue)
    if transaction.origin.POW is None:
        POWService.enqueue_account(transaction.origin)
        raise InvalidPOWException()
    
    if transaction.destination.POW is None:
        # We ignore this if we are sending a first block
        # POWService.enqueue_account(transaction.destination)
        # raise InvalidPOWException()
        pass

    # Start the timestamp before we try to send out the request
    transaction.start_send_timestamp = timezone.now()

    try:
        # After this call, the nano will leave the origin
        transaction.transaction_hash_sending = rpc_origin_node.send(
            wallet=transaction.origin.wallet.wallet_id,
            source=transaction.origin.address,
            destination=transaction.destination.address,
            amount=int(transaction.amount),
            work=transaction.origin.POW,
            id=transaction.id
        )

        # Update the balances and POW
        transaction.origin.current_balance = transaction.origin.current_balance - transaction.amount
        transaction.destination.current_balance = transaction.destination.current_balance + amount
        transaction.origin.POW = None
    except nano.rpc.RPCException as e:
        logger.error(e)
        raise nano.rpc.RPCException()
    
    # Handover control to the timing service (expecting the timestamp to be set on return)
    try:
        time_transaction_send(transaction)
    except:
        pass

    transaction.save()

    max_retries = 20
    incoming_blocks = None

    while (incoming_blocks is None or len(incoming_blocks) == 0) and max_retries > 0:
        rpc_origin_node.republish(hash=transaction.transaction_hash_sending)
        try:
            rpc_destination_node.search_pending_all()
            incoming_blocks = rpc_destination_node.pending(account=transaction.destination.address)
        except nano.rpc.RPCException:
            raise nano.rpc.RPCException()

    # We need to set POW to None because it will be no longer valid as the node will eventually accept the block(s)
    if incoming_blocks is None or len(incoming_blocks) == 0:
        transaction.destination.POW = None
        transaction.save()
        raise NoIncomingBlocksException(transaction.destination.address)
    elif len(incoming_blocks) > 1:
        transaction.destination.POW = None
        transaction.save()
        raise TooManyIncomingBlocksException(transaction.destination.address)

    for block_hash, amount in incoming_blocks:
        transaction.start_receive_timestamp = timezone.now()

        try:
            transaction.transaction_hash_receiving = rpc_destination_node.receive(
                wallet=transaction.destination.wallet.wallet_id,
                account=transaction.destination.address,
                block=block_hash,
                work=transaction.destination.POW
            )
            
            # Update the destination balance
        except nano.rpc.RPCException:
            raise nano.rpc.RPCException()
    
    # Handover control to the timing service (expecting the timestamp to be set on return)
    try:
        time_transaction_receive(transaction)
    except:
        pass

    transaction.destination.POW = None

    transaction.save()

    # Regenerate POW on the accounts
    POWService.enqueue_account(account_id=transaction.origin.address, frontier=transaction.transaction_hash_sending)
    POWService.enqueue_account(account_id=transaction.destination.address, frontier=transaction.transaction_hash_receiving)

    return transaction

def get_transactions():
    models.Transaction.objects.all()

def get_transaction(id):
    try:
        return models.Transaction.objects.get(id=id)
    except models.Transaction.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        raise MultipleObjectsReturned()
