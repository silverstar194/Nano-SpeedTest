import logging
import time

from django.core.management.base import BaseCommand, CommandError

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
        time.sleep(60*10)  # Allow PoW to finish across threads
        logger.info("Clean up task completed...")
