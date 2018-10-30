from django.test import TestCase

from _nodetiming import time_transaction


class TimingTestCase(TestCase):
    def setUp(self):
    	##set up memeber vars

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