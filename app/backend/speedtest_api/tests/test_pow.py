from django.test import TestCase

from speedtest_api.services._pow import POWService


class TestPOW(TestCase):
    def setUp(self):
        pass
    
    def test_dpow(self):
        self.assertIsNotNone(POWService._get_dpow('F076D8F6254F089A8E66D0C934FA63D927F4458FC1D96815066D83B3658ABA26'))
