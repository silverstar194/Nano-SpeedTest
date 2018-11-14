from django.test import TestCase

from speedtest_api.models import Node


class TestNodes(TestCase):
    def setUp(self):
        test_node_1 = Node.objects.create(id=1,
                                          URL="http://127.0.0.1:7076",
                                          latitude=1.1,
                                          longitude=1.1,
                                          location_name="Testville, USA")

        test_node_2 = Node.objects.create(id=2,
                                          URL="http://127.0.0.1:7076",
                                          latitude=1.1,
                                          longitude=1.1,
                                          location_name="Testvegas, USA")
    
    def test_nodes_create(self):
        Node.objects.create(id=3,
                            URL="http://127.0.0.1:7076",
                            latitude=1.1,
                            longitude=1.1,
                            location_name="Testville, USA")
    
    def test_nodes_get(self):
        node = Node.objects.get(id=1)
        assert (node.location_name == "Testville, USA")
    
    def test_nodes_get_all(self):
        nodes = Node.objects.all()
        assert (nodes.count() == 2)
