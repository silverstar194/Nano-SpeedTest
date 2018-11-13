from django.test import TestCase

from speedtest_api.models import Account
from speedtest_api.models import Node
from speedtest_api.models import Wallet


class TestAccounts(TestCase):
    def setUp(self):
        test_node = Node.objects.create(id=1,
                                        URL="http://127.0.0.1:7076",
                                        latitude= 1.1,
                                        longitude=1.1,
                                        location_name="Testville, USA")

        test_wallet = Wallet.objects.create(node=test_node,
                                            wallet_id=1)

        test_account_1 = Account.objects.create(id=1,
                                                wallet=test_wallet,
                                                address=
                                                "xrb_3er5ka9cx6nxtcfapcj77za3n4ne74xbp9b6sbxnuzan9iorxj3xoyy6h1n1",
                                                current_balance=100,
                                                POW="POW")

        test_account_2 = Account.objects.create(id=2,
                                                wallet=test_wallet,
                                                address=
                                                "xrb_3stk814q3ksqopqgeemzk7kduyjzhu355dmmon3ypco3dwbrm6c93wgspsy6",
                                                current_balance=0,
                                                POW="POW")

    def test_accounts_create(self):
        Account.objects.create(id=3,
                               wallet=Wallet.objects.get(id=1),
                               address="xrb_3stk814q3ksqopqgeemzk7kduyjzhu355dmmon3ypco3dwbrm6c93wgspsy6",
                               current_balance=100,
                               POW="POW")
    
    def test_accounts_get(self):
        account = Account.objects.get(id=1)
        assert (account.current_balance == 100)
    
    def test_accounts_get_all(self):
        accounts = Account.objects.all()
        assert (accounts.count() == 2)
