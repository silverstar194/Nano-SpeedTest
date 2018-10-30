import asyncio
import requests
import threading
import time

from django.conf import settings as settings

from .. import models as models
from .accounts import *


class POWService:
    _pow_queue = asyncio.Queue()
    _running = False

    def get_pow(hash):
        """
        Generate a PoW using the distributed endpoint.

        @param hash: Hash to generate PoW for
        @return: Json object containing a work property
        @raise httpError: Can't connect to dPoW, or dPoW timed out
        """

        data = {
                'hash': hash,
                'key': settings.DPOW_API_KEY
            }

        res = requests.post(url=settings.DPOW_ENDPOINT, json=data)

        res.raise_for_status()

        return res.json()

    @classmethod
    def _run(cls):
        while cls._running:
            while not cls._pow_queue.empty():
                address, frontier = cls._pow_queue.get()

                account = get_account(address=address)
                account.POW = get_pow(hash=frontier)
                account.save()
            
            # Run this every second
            time.sleep(1)

    @classmethod
    def enqueue_account(cls, address, frontier):
        cls._pow_queue.put((address, frontier))
    
    @classmethod
    def start(cls):
        cls._running = True
        thread = threading.Thread(target=cls._run)
        thread.daemon = True
        thread.start()

    @classmethod
    def stop(cls):
        cls._running = False
