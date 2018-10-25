#TODO include the python wrapper here
import random
import time


def time_transaction(transaction_hash):
	"""This will return the time delta in the of the sending and recieving block
	@param transaction_hash
	@return time_delta
	"""
	#TODO implement timing

	transaction_time = random.randint(1,5) + random.randint(0,10) / 10.0	
	time.sleep(transaction_time)

	return transaction_time
	