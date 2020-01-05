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
    websocket = create_connection(websocket_address, timeout=10)
    data = {"hash": current_hash}
    logger.info("Opening websocket %s for %s" % (websocket_address, data))
    websocket.send(json.dumps(data))
    result = websocket.recv()
    logger.info("Websocket sent data %s" % (result))
    websocket.close()

    return json.loads(result)['time']

    ## code timing code
    # rpc_node = nano.rpc.Client(node_URL)
    #
    # backoff_sleep_values = [.25] * 40
    # for sleep_value in backoff_sleep_values:
    #     logger.error('in time loop start %s end %s delta %s' % (
    #     start_timestamp, int(round(time.time() * 1000)), int(round(time.time() * 1000)) - start_timestamp))
    #
    #     # cache_key = current_hash+"_"+node_IP  # needs to be unique
    #     # end_time = cache.get(cache_key)  # returns None if no key-value pair
    #     # logger.info("Checking for key %s" % (cache_key))
    #     #
    #     # if end_time:
    #     #     logger.info("Used cache %s %s" % (current_hash, account_address))
    #     #     return end_time
    #
    #     address = account_address
    #     hash_of_block = current_hash
    #     try:
    #
    #         start_rpc = int(round(time.time() * 1000))
    #         history_curr_account = rpc_node.account_history(address, count=1)
    #         logger.error('fetched history_curr_account start %s end %s delta %s' % (
    #             start_timestamp, int(round(time.time() * 1000)), int(round(time.time() * 1000)) - start_timestamp))
    #         after_rpc = int(round(time.time() * 1000))
    #
    #         if start_rpc + 3000 < after_rpc:
    #             raise Exception("RPC account_history took %s" % after_rpc - start_rpc)
    #
    #
    #     except:
    #         logger.error('Unable to get history hash: %s, account: %s' % (current_hash, account_address))
    #         raise ValueError("Unable to get history hash: %s, account: %s" % (current_hash, account_address))
    #
    #     frontier_hash = history_curr_account[0][u'hash']
    #
    #     if hash_of_block == frontier_hash:
    #         logger.info("Used RPC for timing hash %s account %s " % (current_hash, account_address))
    #
    #         start_rpc = int(round(time.time() * 1000))
    #         end_time = int(rpc_node.account_info(address)[u'modified_timestamp']) * 1000
    #         after_rpc = int(round(time.time() * 1000))
    #
    #         if start_rpc + 3000 < after_rpc:
    #             raise Exception("RPC account_info took %s" % after_rpc - start_rpc)
    #
    #         return end_time
    #
    #     for value in history_curr_account:
    #         if value[u'hash'] is hash_of_block:
    #             logger.error("Unable to get hash %s" % hash_of_block)
    #             raise Exception("Unable to get hash %s" % hash_of_block)
    #
    #     time.sleep(sleep_value)
    #
    # logger.error("Transaction was never found %s " % hash_of_block)
    # raise Exception("Transaction never found %s " % hash_of_block)


def time_transaction_receive(transaction, hash_value):
    """
    Will get the time delta of the receiving block
    @param transaction django model of a transaction
    @return delta in seconds of how long it took to get the receiving block
    @raise Exception for when we have missed the transaction
    """

    end_time = transaction_general(transaction.origin.wallet.node.IP_ADD, hash_value)

    # old timing code
    # The database on the nodes is stored as UNIX time
    # The added bias below will account for truncation when needed.
    # The mediam time should remain unbias.
    # Author: silverstar194
    # 3/6/2019
    # if transaction.start_receive_timestamp + 500 >= end_time:
    #     logger.error("Logging receive bias %s %s" % (
    #     str(end_time - transaction.start_receive_timestamp), transaction.transaction_hash_receiving))
    #     transaction.bias_receive = 1000
    #     end_time += 1000

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

    # old timing code
    # The database on the nodes is stored as UNIX time
    # The added bias below will account for truncation when needed.
    # The mediam time should remain unbias.
    # Author: silverstar194
    # 3/6/2019
    # if transaction.start_send_timestamp + 500 >= end_time:
    #     logger.error("Logging send bias %s %s" % (
    #     str(end_time - transaction.start_send_timestamp), transaction.transaction_hash_sending))
    #     transaction.bias_send = 1000
    #     end_time += 1000

    transaction.end_send_timestamp = end_time
    transaction.save()
    return end_time
