import time

from django.core.management.base import BaseCommand, CommandError
import nano

from ...models import *
from ...services import *


class Command(BaseCommand):
    def handle(self, *args, **options):
        accounts.sync_accounts()
