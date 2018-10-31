import datetime as datetime
import requests

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
        Exception.__init__(self, "{0} != {0} for account: {0}".format((balance_actual, balance_db, account)))

class InsufficientNanoException(Exception):
    def __init__(self):
        Exception.__init__(self, "The Nano account did not have enough RAW to make a transaction.")

class AddressDoesNotExistException(Exception):
    def __init__(self, account, wallet):
        Exception.__init__(self, "The Nano address {0} does not exist on wallet {0}".format((account, wallet)))

class NoIncomingBlocksException(Exception):
    def __init__(self):
        Exception.__init__(self, "There were no incoming blocks to receive for the account specified.")

class TooManyIncomingBlocksException(Exception):
    def __init__(self):
        Exception.__init__(self, "There were more than one incoming blocks for the account specified.")

class InvalidPOWException(Exception):
    def __init__(self):
        Exception.__init__(self, "The POW on the account was not valid.")


def new_transaction(initiated_by):
    # TODO: Select accounts and amount

    return new_transaction(origin_account, destination_account, amount, initiated_by)

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
    rpc_origin_node = nano.rpc.Client(transaction.origin.wallet.node.IP)
    rpc_destination_node = nano.rpc.Client(transaction.destination.wallet.node.IP)

    # Do some origin balance checking
    origin_balance = rpc_origin_node.account_balance(account=transaction.origin.address)
    if (origin_balance != origin_account.current_balance):
        raise AccountBalanceMismatchException(
            balance_actual=origin_balance, 
            balance_db=origin_account.current_balance,
            account=origin_account.address
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
    if transaction.origin.POW is None or transaction.destination.POW is None:
        raise InvalidPOWException()

    # Start the timestamp before we try to send out the request
    transaction.start_send_timestamp = datetime.now()

    try:
        transaction.transaction_hash_sending = rpc_origin_node.send(
            wallet=transaction.origin.wallet.wallet_id,
            source=transaction.origin.address,
            destination=transaction.destination.address,
            amount=transaction.amount,
            work=transaction.origin.POW,
            id=transaction.id
        )
        
        # Update the origin balance
        transaction.origin.current_balance = transaction.origin.current_balance - amount
    except nano.rpc.RPCException:
        raise nano.rpc.RPCException()
    
    # Handover control to the timing service (expecting the timestamp to be set on return)
    # TODO: implement error handling
    time_transaction_send(transaction)

    try:
        incoming_blocks = rpc_destination_node.accounts_pending(accounts=(transaction.origin.address))
    except nano.rpc.RPCException:
        raise nano.rpc.RPCException()

    if incoming_blocks[transaction.origin.address] is None or len(incoming_blocks[transaction.origin.address]) == 0:
        raise NoIncomingBlocksException()
    elif len(incoming_blocks[transaction.origin.address]) > 1:
        raise TooManyIncomingBlocksException()

    # Check to see if this block_hash is the same as the transaction_hash_sending
    for block_hash in incoming_blocks[transaction.origin.address]:
        transaction.start_receive_timestamp = datetime.now()

        try:
            transaction.transaction_hash_receiving = rpc_destination_node.receive(
                wallet=transaction.destination.wallet.wallet_id,
                account=transaction.destination.address,
                block=block_hash,
                work=transaction.destination.POW
            )
            
            # Update the destination balance
            transaction.destination.current_balance = transaction.destination.current_balance + amount
        except nano.rpc.RPCException:
            raise nano.rpc.RPCException()
    
    # Handover control to the timing service (expecting the timestamp to be set on return)
    # TODO: implement error handling
    time_transaction_receive(transaction)

    # We set these to None so they are known to be invalid
    transaction.origin.POW = None
    transaction.destination.POW = None

    transaction.save()

    # Regenerate POW on the accounts
    POWService.enqueue_account(account_id=transaction.origin.address)
    POWService.enqueue_account(account_id=transaction.destination.address)

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
