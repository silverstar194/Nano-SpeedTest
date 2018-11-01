from io import StringIO

from django.core.management import call_command
from django.test import TestCase


class TestAccountBalancer(TestCase):
    def setUp(self):
        pass
    
    def test_account_balancer(self):
        # TODO: Complete this with an expected output
        # Since this is testing a manage.py command, it is a bit more difficult
        
        out = StringIO()
        call_command('closepoll', stdout=out)
        self.assertIn('Expected output', out.getvalue())
