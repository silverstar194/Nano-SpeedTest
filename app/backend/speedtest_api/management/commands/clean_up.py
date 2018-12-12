import logging
import time
import requests

from django.core.management.base import BaseCommand, CommandError
from multiprocessing.pool import ThreadPool
import nano

from ...models import *
from ...services import *


logger = logging.getLogger(__name__)

class BalancingException(Exception):
    def __init__(self):
        Exception.__init__(self, "Error occurred in the balance process.")

class Command(BaseCommand):
    help = "Cleans up and validates database state"
    def handle(self, *args, **options):
        """
       Cleans up and validates database state same as start up.
       Django auto runs startup code for ant command

        """
        pass