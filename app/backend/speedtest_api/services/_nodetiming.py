import datetime
import random
import time
import logging

from django.utils import timezone
from django.core.cache import cache

import nano

# Get an instance of a logger 
logger = logging.getLogger(__name__)

def transaction_general(node_URL, node_IP, account_address, current_hash, start_timestamp, ):
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

	rpc_node = nano.rpc.Client(node_URL)

	#Sleep times are incase we are still waiting for the transcation to go through

	backoff_sleep_values =[6] + [.5]*60
	for sleep_value in backoff_sleep_values:

		address = account_address
		hash_of_block= current_hash

		cache_key = current_hash+"_"+node_IP  # needs to be unique
		end_time = cache.get(cache_key)  # returns None if no key-value pair
		logger.info(cache_key)

		if end_time:
			return end_time

		time.sleep(sleep_value)
		#
		# try:
		# 	history_curr_account = rpc_node.account_history(address, count = 5) #magic assuming that if it is not 5 back it hasn't been received
		# except:
		# 	logger.error('Unable to get history hash: %s, account: %s' %(current_hash, account_address))
		# 	raise ValueError("Unable to get history hash: %s, account: %s" %(current_hash, account_address))
        #
		# frontier_hash = history_curr_account[0][u'hash']
        #
		# if hash_of_block == frontier_hash:
		# 	end_time = int(rpc_node.account_info(address)[u'modified_timestamp']) * 1000
        #
		# 	return end_time
		#
		# for value in history_curr_account:
		# 	if value[u'hash'] is hash_of_block:
		# 		logger.error("Unable to get hash %s" % hash_of_block)
		# 		raise Exception("Unable to get hash %s" % hash_of_block)


	logger.error("Transaction was never found %s " % hash_of_block)
	raise Exception("Transaction never found %s " % hash_of_block) 

def time_transaction_receive(transaction):
	"""
	Will get the time delta of the receiving block
	@param transaction django model of a transaction
	@return delta in seconds of how long it took to get the receiving block
	@raise Exception for when we have missed the transaction
	"""
	end_time = transaction_general(transaction.origin.wallet.node.URL,
		transaction.origin.wallet.node.IP,
		transaction.destination.address, 
		transaction.transaction_hash_receiving, 
		transaction.start_receive_timestamp)
	
	transaction.end_receive_timestamp = end_time
	transaction.save()
	return	end_time

def time_transaction_send(transaction):
	"""
	Will get the time delta of the sendig block
	@param transaction django model of a transacton
	@return delta in seconds of how long it took to get the sending block
	@raise Exception for when we have missed the transaction
	"""
	end_time = transaction_general(transaction.destination.wallet.node.URL,
	transaction.destination.wallet.node.IP,
	 transaction.origin.address, 
	 transaction.transaction_hash_sending,
	 transaction.start_send_timestamp)
	
	transaction.end_send_timestamp = end_time
	transaction.save()
	return	end_time

