from io import StringIO

from django.core.management import call_command
from django.test import TestCase


class TestAccountBalancer(TestCase):
    def setUp(self):
        pass
    
    def test_account_balancer(self):
        out = StringIO()
        call_command('closepoll', stdout=out)
        self.assertIn('Expected output', out.getvalue())
