import datetime
import random
import time
import logging

import nano


class BlockAlreadyInHistoryException(Exception):
	"""
	This is a specific error that had no standard error appropriate for it
	"""
    def __init___(self,dErrorArguments):
        Exception.__init__(self,"Block hash is not frontier {0}".format(dErrArguments))
        self.dErrorArguments = dErrorArguements



def transcation_general(node_IP, account_address, current_hash, start_timestamp):
	"""
	This to time the sending and recieving of blocks
	@return delta of how long send or receive took in seconds
	@param node_IP address of client
	@param account_address account address
	@param current_hash hash of the part of transcation we are interested in
	@param start_timestamp the start of time the transaction
	@param raise ValueError for unable to get the history for any reason
	@raise BlockAlreadyInHistoryException for when we have missed the  transaction
	"""
	rpc_node = nano.rpc.Client(node_IP)
	
	# Get an instance of a logger
	logger = logging.getLogger(__name__)

		#Sleep times are for incase we are still waiting for the transcation to go through
		backoff_sleep_values = [1,1,2,3,5,8]/2.0
		for sleep_value in backoff_sleep_values:

			address = account_address
			hash_of_block= current_hash

			try:
				history_curr_account = rpc_node.account_history(address, account = 5) #magic assuming that if it is not 5 back it hasn't been received 
			except:
				logger.error('Unable to get history')
				raise ValueError("Unable to get history")

			frontier_hash = history_curr_account[0][u'hash']

			if hash_of_block == frontier_hash:
				end_time = rpc_sending_node.account_info(address)[u'modified_timestamp']
				end_time = datetime.datetime.fromtimestamp(end_time)

				return end_time- start_timestamp
			
			for value in history_curr_account:
				if value[u'hash'] is hash_of_block:
					logger.error("Unable to get hash of following block %s" %hash_of_block)
					raise BlockAlreadyInHistoryException(hash_of_block)

			time.sleep(sleep_value)


		logger.error("Transaction was never found")
		raise TimeoutError("Transaction never found") 


def time_transaction_recieve(transcation):
	"""
	Will get the time delta of the receiving block
	@param transaction django model of a transaction
	@return delta in seconds of how long it took to get the receiving block
	"""
	return transcation_general(transaction.node_IP, transcation.destination.address, transaction.transaction_hash_receiving, transcation.start_timestamp)



def time_transaction_send(transcation):
	"""
	Will get the time delta of the sendig block
	@param transaction django model of a transacton
	@return delta in seconds of how long it took to get the sending block
	"""
	return transcation_general(transaction.node_IP, transaction.origin.address, transaction.transaction_hash_sending,transaction.start_timestamp)

