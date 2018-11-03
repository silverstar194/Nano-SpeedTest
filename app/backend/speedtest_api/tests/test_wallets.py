from django.test import TestCase

from speedtest_api.models import Node
from speedtest_api.models import Wallet



class TestWallet(TestCase):
    def setUp(self):
        test_node = Node.objects.create(id=1,
                                        IP="http://127.0.0.1:7076",
                                        latitude=1.1,
                                        longitude=1.1,
                                        location_name="Testville, USA")

        test_wallet_1 = Wallet.objects.create(node=test_node,
                                              wallet_id=1)

        test_wallet_2 = Wallet.objects.create(node=test_node,
                                              wallet_id=2)
    
    def test_wallets_create(self):
        Wallet.objects.create(node=Node.objects.get(id=1), wallet_id=3)
    
    def test_wallets_get(self):
        wallet = Wallet.objects.get(wallet_id=1)
        assert (wallet.node.id == 1)
    
    def test_wallets_get_all(self):
        wallets = Wallet.objects.all()
        assert (wallets.count() == 2)
