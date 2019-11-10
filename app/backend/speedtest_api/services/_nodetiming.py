import logging
from websocket import create_connection
import json

# Get an instance of a logger 
logger = logging.getLogger(__name__)


def transaction_general(node_IP, current_hash):
    """
    This to time the sending and recieving of blocks
    @return delta of how long send or receive took in seconds
    @param node_URL address of client
    @param account_address account address
    @param current_hash hash of the part of transcation we are interested in
    @param start_timestamp the start of time the transaction
    @param raise ValueError for unable to get the history for any reason
    @raise Exception for when we have missed the transaction
    """

    websocket_address = "ws://"+node_IP+":7090/call"
    websocket = create_connection(websocket_address)
    data = {"hash": current_hash}
    logger.info("Opening websocket %s for %s" % (websocket_address, data))
    websocket.send(json.dumps(data))
    result = websocket.recv()
    logger.info("Websocket sent data %s" % (result))
    websocket.close()

    return json.loads(result)['time']

def time_transaction_receive(transaction, hash_value):
    """
    Will get the time delta of the receiving block
    @param transaction django model of a transaction
    @return delta in seconds of how long it took to get the receiving block
    @raise Exception for when we have missed the transaction
    """

    end_time = transaction_general(transaction.origin.wallet.node.IP_ADD, hash_value)

    transaction.end_receive_timestamp = end_time
    transaction.save()
    return end_time


def time_transaction_send(transaction, hash_value):
    """
    Will get the time delta of the sendig block
    @param transaction django model of a transacton
    @return delta in seconds of how long it took to get the sending block
    @raise Exception for when we have missed the transaction
    """

    end_time = transaction_general(transaction.destination.wallet.node.IP_ADD, hash_value)

    transaction.end_send_timestamp = end_time
    transaction.save()
    return end_time
