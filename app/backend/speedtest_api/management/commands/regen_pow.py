import time

from django.core.management.base import BaseCommand, CommandError
import nano

from ...models import *
from ...services import *
from ...services._pow import POWService


class Command(BaseCommand):
    def handle(self, *args, **options):
        POWService.POW_accounts(daemon=False)
