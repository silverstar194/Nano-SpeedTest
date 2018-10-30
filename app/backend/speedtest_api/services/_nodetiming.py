import datetime
import random
import time

import nano


class BlockAlreadyInHistoryException(Exception):
    def __init___(self,dErrorArguments):
        Exception.__init__(self,"Block hash is not frontier {0}".format(dErrArguments))
        self.dErrorArguments = dErrorArguements


def transcation_general(node_IP, account_address, current_hash, start_timestamp)
	rpc_node = nano.rpc.Client(node_IP)

		backoff_sleep_values = [1,1,2,3,5,8]/2.0
		for sleep_value in backoff_sleep_values:

			address = account_address
			hash_of_block= current_hash

			try:
				history_curr_account = rpc_node.account_history(address, account = 5) #magic assuming that if it is not 5 back it hasn't been received 
			except:
				raise ValueError("Unable to get history")

			frontier_hash = history_curr_account[0][u'hash']

			if hash_of_block == frontier_hash:
				end_time = rpc_sending_node.account_info(address)[u'modified_timestamp']
				end_time = datetime.datetime.fromtimestamp(end_time)

				return end_time- start_timestamp
			
			for value in history_curr_account:
				if value[u'hash'] is hash_of_block:
					raise BlockAlreadyInHistoryException(hash_of_block)

			time.sleep(sleep_value)

		raise TimeoutError("Transaction never found") 


def time_transaction_recieve(transcation):
	return transcation_general(transaction.node_IP, transcation.destination.address, transaction.transaction_hash_receiving, transcation.start_timestamp)



def time_transaction_send(transcation):
	return transcation_general(transaction.node_IP, transaction.origin.address, transaction.transaction_hash_sending,transaction.start_timestamp)

