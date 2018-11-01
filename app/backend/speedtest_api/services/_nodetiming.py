import datetime
import random
import time
import logging

import nano

# Get an instance of a logger 
logger = logging.getLogger(__name__)

def transaction_general(node_IP, account_address, current_hash, start_timestamp, ):
	"""
	This to time the sending and recieving of blocks
	@return delta of how long send or receive took in seconds
	@param node_IP address of client
	@param account_address account address
	@param current_hash hash of the part of transcation we are interested in
	@param start_timestamp the start of time the transaction
	@param raise ValueError for unable to get the history for any reason
	@raise Exception for when we have missed the transaction
	"""

	rpc_node = nano.rpc.Client(node_IP)

	#Sleep times are incase we are still waiting for the transcation to go through
	fib_seq =[1,1,2,3,5,8]
	backoff_sleep_values = [x/2.0 for x in fib_seq]
	for sleep_value in backoff_sleep_values:

		address = account_address
		hash_of_block= current_hash

		try:
			history_curr_account = rpc_node.account_history(address, count = 5) #magic assuming that if it is not 5 back it hasn't been received 
		except:
			logger.error('Unable to get history hash: %s, account: %s' %(current_hash, account_address))
			raise ValueError("Unable to get history hash: %s, account: %s" %(current_hash, account_address))

		frontier_hash = history_curr_account[0][u'hash']

		if hash_of_block == frontier_hash:
			end_time = rpc_node.account_info(address)[u'modified_timestamp']
			end_time = datetime.datetime.fromtimestamp(end_time)

			return end_time.timestamp()- start_timestamp.timestamp()
		
		for value in history_curr_account:
			if value[u'hash'] is hash_of_block:
				logger.error("Unable to get hash %s" % hash_of_block)
				raise Exception("Unable to get hash %s" % hash_of_block)

		time.sleep(sleep_value)


	logger.error("Transaction was never found %s " % hash_of_block)
	raise Exception("Transaction never found %s " % hash_of_block) 

def time_transaction_receive(transaction):
	"""
	Will get the time delta of the receiving block
	@param transaction django model of a transaction
	@return delta in seconds of how long it took to get the receiving block
	@raise Exception for when we have missed the transaction
	"""
	time_delta = transaction_general(transaction.origin.wallet.node.IP, 
		transaction.destination.address, 
		transaction.transaction_hash_receiving, 
		transaction.start_send_timestamp)
	
	transaction.end_receive_timestamp = transaction.start_receive_timestamp + datetime.timedelta(seconds=time_delta)
	transaction.save()
	return time_delta

def time_transaction_send(transaction):
	"""
	Will get the time delta of the sendig block
	@param transaction django model of a transacton
	@return delta in seconds of how long it took to get the sending block
	@raise Exception for when we have missed the transaction
	"""
	time_delta = transaction_general(transaction.destination.wallet.node.IP,
	 transaction.origin.address, 
	 transaction.transaction_hash_sending,
	 transaction.start_receive_timestamp)
	
	transaction.end_send_timestamp = transaction.start_send_timestamp + datetime.timedelta(seconds=time_delta)
	transaction.save()
	return time_delta

