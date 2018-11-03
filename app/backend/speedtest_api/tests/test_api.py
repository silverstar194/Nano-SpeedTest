from rest_framework.test import APITestCase

from speedtest_api.models import Account
from speedtest_api.models import Node
from speedtest_api.models import Transaction
from speedtest_api.models import Wallet


class ApiTests(APITestCase):
    def setUp(self):
        mumbai_node = Node.objects.create(IP="http://127.0.0.1:7076",
                                          latitude=1.1,
                                          longitude=1.1,
                                          location_name="Mumbai")

        virginia_node = Node.objects.create(IP="http://127.0.0.1:7077",
                                            latitude=1.1,
                                            longitude=1.1,
                                            location_name="N. Virginia")

        mumbai_wallet = Wallet.objects.create(node=mumbai_node)
        virginia_wallet = Wallet.objects.create(node=virginia_node)

        mumbai_account = Account.objects.create(wallet=mumbai_wallet,
                                                address=
                                                "xrb_3er5ka9cx6nxtcfapcj77za3n4ne74xbp9b6sbxnuzan9iorxj3xoyy6h1n1",
                                                current_balance=10000000000000000000000,
                                                POW="POW")

        virginia_account = Account.objects.create(wallet=virginia_wallet,
                                                  address=
                                                  "xrb_3stk814q3ksqopqgeemzk7kduyjzhu355dmmon3ypco3dwbrm6c93wgspsy6",
                                                  current_balance=10000000000000000000000,
                                                  POW="POW")

        transaction = Transaction.objects.create(id=27,
                                                 origin=virginia_account,
                                                 destination=mumbai_account,
                                                 start_send_timestamp=1483050400869,
                                                 end_send_timestamp=1483050400869,
                                                 start_receive_timestamp=1483250400869,
                                                 end_receive_timestamp=1483050400869,
                                                 amount=202,
                                                 initiated_by="127.0.0.1",
                                                 transaction_hash_sending=
                                                 "F26A33F2238F365CE0E154429C2AEBAC968930912C7C8BBC3B5667EDFEE36D8C",
                                                 transaction_hash_receiving=
                                                 "A210BC22CD295D78F4E21347F1C041150911D6208E04BE0EA65433DCCFA1577D"
                                                 )

    def test_random_transaction(self):
        response = self.client.get('/transactions/random', format='json')
        self.assertEqual(response.status_code, 200)

    def test_send_transaction_negative_404(self):
        send_response = self.client.post('/transactions/send', {'id': 0}, format='json')
        self.assertEqual(send_response.status_code, 404)

    def test_send_transaction_negative_403(self):
        send_response = self.client.post('/transactions/send', {'id': 27}, format='json')
        self.assertEqual(send_response.status_code, 403)

    #  TODO: Add positive test for sending a transaction, will require setting up a live node during the test
