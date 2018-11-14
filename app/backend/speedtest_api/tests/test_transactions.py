from django.test import TestCase

from speedtest_api.services import *
import speedtest_api.models as models


class TestTransactions(TestCase):
    def setUp(self):
        curr_Node = models.Node.objects.create(URL="http://127.0.0.1:7076", latitude= 1.1, longitude=1.1, location_name='')
        curr_Node2 = models.Node.objects.create(URL="http://127.0.0.2:7076", latitude= 1.0, longitude=1.0, location_name='')

        wallet_sending = models.Wallet.objects.create(node=curr_Node)
        wallet_receiving = models.Wallet.objects.create(node=curr_Node2)

        account_sending = models.Account.objects.create(wallet=wallet_sending, 
            address="xrb_3er5ka9cx6nxtcfapcj77za3n4ne74xbp9b6sbxnuzan9iorxj3xoyy6h1n1",
            current_balance=0, 
            POW="POW")

        account_receiving = models.Account.objects.create(wallet=wallet_receiving, 
            address="xrb_3stk814q3ksqopqgeemzk7kduyjzhu355dmmon3ypco3dwbrm6c93wgspsy6", 
            current_balance=0, 
            POW="POW")

        known_transaction = models.Transaction.objects.create(
            origin=account_sending,
            destination=account_receiving,
            amount=1000,
            initiated_by='127.0.0.1'
        )
    
    def test_transactions_create(self):
        transaction_test = transactions.new_transaction_random('127.0.0.1')

        self.assertIsNotNone(models.Transaction.objects.get(id=transaction_test.id))
    
    def test_transactions_get(self):
        transaction_test = transactions.new_transaction_random('127.0.0.1')

        self.assertIsNotNone(transactions.get_transaction(id=transaction_test.id))
    
    def test_transactions_get_all(self):
        transaction_test = transactions.new_transaction_random('127.0.0.1')

        self.assertIs(len(transactions.get_transactions()) > 1, True)
