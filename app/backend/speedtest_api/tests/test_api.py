import json

from rest_framework.test import APITestCase


from speedtest_api.models import Node

class ApiTests(APITestCase):
    def setUp(self):
        test_node_1 = Node.objects.create(id=1,
                                          URL="http://127.0.0.1:7076",
                                          latitude=1.1,
                                          longitude=1.1,
                                          location_name="Testville, USA")


    def test_transaction_stats(self):
        response = self.client.get('/transactions/statistics?count=100', format='json')
        self.assertEqual(response.status_code, 200)

    def test_random_ad(self):
        send_response = self.client.post('/advertisements/random', format='json')
        self.assertEqual(send_response.status_code, 200)

    def test_list_nodes(self):
        send_response = self.client.get('/nodes/list', format='json')
        data = json.loads(send_response.text)
        assert(len(data["nodes"]) == 0)
        self.assertEqual(send_response.status_code, 200)


    ##TODO: Add positive test for sending a transaction, will require setting up a live node during the test
