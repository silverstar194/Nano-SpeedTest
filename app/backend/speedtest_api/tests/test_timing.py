from django.test import TestCase

from _nodetiming import time_transaction


class TimingTestCase(TestCase):
    def setUp(self):
    	##set up memeber vars
    curr_Node = Node.objects.create("localhost:7076")

    wallet_sending = Wallet.objects.create(curr_Node)
    wallet_receiving = Wallet.objects(curr_Node)

    account_sending = Account(wallet_sending, "xrb_3er5ka9cx6nxtcfapcj77za3n4ne74xbp9b6sbxnuzan9iorxj3xoyy6h1n1",0, "POW")
    account_receiving = Account(wallet_receiving, "")

    #Check to see what happens when the hash is in the frontier
    def test_when_hash_in_frontier():
    	pass

    #check to see what happens when the hash is in the history
    def test_when_hash_in_history():
    	pass
    	
	#check to see what happens when the hash is not in the history
    def test_when_hash_not_found():
    	pass
    
    #check to see what happens when the node is down
    def test_when_node_is_down():
    	pass