import datetime
import pytz

from django.test import TestCase

from ..services._nodetiming import *
from ..models import Node
from ..models import Wallet
from ..models import Account
from ..models import Transaction


class TimingTestCase(TestCase):
    def setUp(self):
    	## Set up testing vars
        curr_Node = Node.objects.create(URL="http://127.0.0.1:7076", latitude= 1.1, longitude=1.1, location_name="Test") #"http://localhost:7076")

        wallet_sending = Wallet.objects.create(node=curr_Node)
        wallet_receiving = Wallet.objects.create(node=curr_Node)

        account_sending = Account.objects.create(wallet=wallet_sending, 
            address="xrb_3er5ka9cx6nxtcfapcj77za3n4ne74xbp9b6sbxnuzan9iorxj3xoyy6h1n1",
            current_balance=0, 
            POW="POW")

        account_receiving = Account.objects.create(wallet=wallet_receiving, 
            address="xrb_3stk814q3ksqopqgeemzk7kduyjzhu355dmmon3ypco3dwbrm6c93wgspsy6", 
            current_balance=0, 
            POW="POW")


        transaction_too_far_back = Transaction.objects.create(origin=account_sending,
            destination=account_receiving,
            start_send_timestamp=1483050400869,
            end_send_timestamp=None,
            start_receive_timestamp=1483250400869,
            end_receive_timestamp=None,
            amount=202,
            initiated_by="127.0.0.1:7076",
            transaction_hash_sending="F26A33F2238F365CE0E154429C2AEBAC968930912C7C8BBC3B5667EDFEE36D8C",
            transaction_hash_receiving="A210BC22CD295D78F4E21347F1C041150911D6208E04BE0EA65433DCCFA1577D"
            )
        
        transaction_front = Transaction.objects.create(origin=account_sending,
            destination=account_receiving,
            start_send_timestamp=1483050400869,
            end_send_timestamp=None,
            start_receive_timestamp=1483250400869,
            end_receive_timestamp=None,
            amount=303,
            initiated_by="127.0.0.1:7076",
            transaction_hash_sending="4D8077C3814ED5A9290C6904732928FF04FABAF67B6D6FB413F78DE9EB788AE4",
            transaction_hash_receiving="C1C774242A037B893A498313944DEEDB9DE6512FEAE3E172C4A3AE2B3BA935D2"
            )

        transaction_middle = Transaction.objects.create(origin=account_sending, 
            destination=account_receiving,
            start_send_timestamp=1483050400869,
            end_send_timestamp=None,
            start_receive_timestamp=1483250400869,
            end_receive_timestamp=None,
            amount=404,
            initiated_by="127.0.0.1:7076",
            transaction_hash_sending="7F05B375E486BE6733793131DCB2BCECA2C2DE775769F743CE8BFE6B2F65E2C0",
            transaction_hash_receiving="A4B8E17AC04333FC6CE89FC4F507B386D3EBE0DD331E6041837164AB4BFEB72C"
            )
    
    #Check to see what happens when the hash is in the frontier
    def test_when_hash_in_frontier_receive(self):
        transaction = Transaction.objects.get(amount = 303)
        assert(transaction.end_receive_timestamp == None)
        assert(time_transaction_receive(transaction) > 1)
        assert(transaction.end_receive_timestamp != None)

    def test_when_hash_in_frontier_send(self):
        assert(time_transaction_send(Transaction.objects.get(amount = 303)) > 1)

    #check to see what happens when the hash is in the history
    def test_when_hash_in_history_receive(self):
        self.assertRaises(Exception, time_transaction_receive,(Transaction.objects.get(amount=404)))
    
    def test_when_hash_in_history_send(self):
        self.assertRaises(Exception, time_transaction_send, (Transaction.objects.get(amount=404)))
    	
	#check to see what happens when the hash is not in the history
    def test_when_hash_not_found_receive(self):
    	self.assertRaises(Exception, time_transaction_receive, Transaction.objects.get(amount = 202))

    def test_when_hash_not_found_send(self):
        self.assertRaises(Exception, time_transaction_send, Transaction.objects.get(amount = 202)) 
    
    #check to see what happens when the node is down
    def test_when_node_is_down(self):
        ## Bad URL given
        curr_Node = Node.objects.create(URL="http://0.0.0.1:7076", latitude= 1.1, longitude=1.1, location_name='Test')
        self.assertRaises(Exception, time_transaction_send, Transaction.objects.get(amount = 202))


