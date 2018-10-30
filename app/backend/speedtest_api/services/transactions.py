import datetime as datetime
import requests

from django.conf import settings as settings
import nano

from .. import models as models
from .wallets import *
from .nodes import *
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


def new_transaction(origin_account, destination_account, amount, initiated_by):
    transaction = models.Transaction(origin=origin_account.id, 
                                     destination=destination_account.id,
                                     amount=amount,
                                     initiated_by=initiated_by)
    
    origin_wallet = get_wallet(id=origin_account.wallet)
    destination_wallet = get_wallet(id=destination_account.wallet)

    origin_node = get_node(id=origin_wallet.node)
    destination_node = get_node(id=destination_wallet.node)

    rpc_origin_node = nano.rpc.Client(origin_node.IP)
    rpc_destination_node = nano.rpc.Client(destination_node.IP)

    # Do some origin balance checking
    origin_balance = rpc_origin_node.account_balance(account=origin_account.address)
    if (origin_balance != origin_account.current_balance):
        raise AccountBalanceMismatchException(balance_actual=origin_balance, 
                                              balance_db=origin_account.current_balance,
                                              account=origin_account.address)
    elif (origin_balance - amount <= 0):
        raise InsufficientNanoException()
    
    # Make sure the wallet contains the account address
    if (not rpc_origin_node.wallet_contains(wallet=origin_wallet.wallet_id, account=origin_account.address)):
        raise AddressDoesNotExistException(wallet=origin_wallet, account=origin_account.address)
    
    if (not rpc_destination_node.wallet_contains(wallet=destination_wallet.wallet_id, account=destination_account.address)):
        raise AddressDoesNotExistException(wallet=destination_wallet, account=destination_account.address)

    # Make sure the POW is there (not in the POW regen queue)
    if origin_account.POW is None or destination_account.POW is None:
        raise InvalidPOWException()

    # Start the timestamp before we try to send out the request
    transaction.start_timestamp = datetime.now()

    try:
        rpc_origin_node.send(wallet=origin_wallet.wallet_id,
                            source=origin_account.address,
                            destination=destination_account.address,
                            amount=amount,
                            work=origin_account.POW,
                            id=transaction.id)
        
        origin_account.current_balance = origin_account.current_balance - amount
    except nano.rpc.RPCException:
        raise nano.rpc.RPCException()
    
    # Save this here as the transaction has been sent
    transaction.save()
    
    origin_account.POW = None
    
    try:
        incoming_blocks = rpc_destination_node.accounts_pending(accounts=(origin_account.address))
    except nano.rpc.RPCException:
        raise nano.rpc.RPCException()

    if incoming_blocks[origin_account.address] is None or len(incoming_blocks[origin_account.address]) == 0:
        raise NoIncomingBlocksException()
    elif len(incoming_blocks[origin_account.address]) > 1:
        raise TooManyIncomingBlocksException()

    for block_hash in incoming_blocks[origin_account.address]:
        try:
            rpc_destination_node.receive(wallet=destination_wallet.wallet_id,
                                        account=destination_account.address,
                                        block=block_hash,
                                        work=destination_account.POW)
            
            destination_account.current_balance = destination_account.current_balance + amount
        except nano.rpc.RPCException:
            raise nano.rpc.RPCException()
    
    destination_account.POW = None

    # Handover control to the timing service (expecting the timestamp to be sent on return)
    # TODO: implement error handling
    time_transaction(transaction)

    transaction.save()
    origin_account.save()
    destination_account.save()

    # Regenerate POW on the accounts
    POWService.enqueue_account(account_id=origin_account.address)
    POWService.enqueue_account(account_id=destination_account.address)

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
