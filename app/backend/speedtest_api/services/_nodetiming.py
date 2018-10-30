import datetime
import random
import time

import nano


class BlockAlreadyInHistoryException(Exception):
    def __init___(self,dErrorArguments):
        Exception.__init__(self,"Block hash is not frontier {0}".format(dErrArguments))
        self.dErrorArguments = dErrorArguements

def time_transaction_send(transcation):
	rpc_sending_node = nano.rpc.Client(transcation.origin.wallet.node.IP)

	backoff_sleep_values = [1,1,2,3,5,8]

	
	for sleep_value in backoff_sleep_values:

		origin_address = transcation.destination.address
		hash_sending = transcation.transaction_hash_sending

		try:
			history_sending_account = rpc_sending_node.account_history(origin_address, account = 5) #magic assuming that if it is not 5 back it hasn't been received 
		except:
			raise ValueError("Unable to get history")

		frontier_hash = history_sending_account[0][u'hash']

		if hash_sending == frontier_hash:
			end_time = rpc_sending_node.account_info(origin_address)[u'modified_timestamp']
			end_time = datetime.datetime.fromtimestamp(end_time)

			return end_time- transaction.start_timestamp
		
		for value in history_sending_account:
			if value[u'hash'] is hash_sending:
				raise BlockAlreadyInHistoryException(hash_sending)

		time.sleep(sleep_value)

	raise TimeoutError("Transaction never found") 


def time_transaction_receive(transcation):
	"""This will return the time delta in the of the sending and recieving block for a more granular time, we use a timer to get miliseconds for the send time
	@param transcation block for the recieving wallet
	@return time_delta
	:raises Exception: TimeoutError 
	:raises Exception: BlockAlreadyInHistoryException
	:raises Excpetion: RPCException
	"""	
	#Try this three time with a second in between TODO
	rpc_receiving_node = nano.rpc.Client(transcation.destination.wallet.node.IP)

	backoff_sleep_values = [1,1,2,3,5,8]
	
	for sleep_value in backoff_sleep_values:

		destination_address = transcation.destination.address
		hash_receiving = transaction.transaction_hash_receiving

		try:
			history_receiving_account = rpc_receiving_node.account_history(destination_address, count = 5) # magic assuming that if it is not 5 back it hasn't been received
		except:
			raise ValueError("Unable to get history")


		frontier_hash = history_receiving_account[0][u'hash']
		
		if hash_receiving == frontier_hash:
			end_time = rpc_receiving_node.account_info(destination_address)[u'modified_timestamp'] 
			end_time = datetime.datetime.fromtimestamp(end_time)
			
			#Add this to the model
			transcation.end_time = end_time
			transcation.save()

			return end_time - transaction.start_timestamp

		for value in history_receiving_account:
			if value[u'hash'] is hash_receiving:
				raise BlockAlreadyInHistoryException(hash_receiving)
				# see if we recieved it already

		time.sleep(sleep_value)

	raise TimeoutError("Transaction never found") 

