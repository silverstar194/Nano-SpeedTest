import datetime
import logging
import queue
import requests
import threading
import time

from django.conf import settings as settings
import nano

from .. import models as models
from .accounts import *


class POWService:
    _pow_queue = queue.Queue()
    _running = False
    loop = None
    logger = logging.getLogger(__name__)
    thread = None

    @classmethod
    def get_pow(cls, address, hash):
        try:
            return cls._get_dpow(hash)['work']
        except Exception as e:
            pass
        
        account = get_account(address=address)
        rpc_node = nano.rpc.Client(account.wallet.node.IP)

        return rpc_node.work_generate(hash)

    @classmethod
    def _get_dpow(cls, hash):
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
        try:
            while cls._running:
                while not cls._pow_queue.empty():
                    try:
                        address, frontier = cls._pow_queue.get()

                        account = get_account(address=address)
                        account.POW = cls.get_pow(address=address, hash=frontier)

                        cls.logger.info('Generated POW: %s for account %s' % (account.POW, account.address))

                        account.save()
                    except Exception as e:
                        cls.logger.error('Exception in POW thread: ' + e)
                
                # Run this every second
                time.sleep(10)
        except Exception as e:
            cls.logger.error(e)
            print(e)

    @classmethod
    def enqueue_account(cls, address, frontier):
        cls._pow_queue.put((address, frontier))
    
    @classmethod
    def start(cls, daemon=True):
        if not cls._running:
            # Use a condition to wait until this value is set to True and set it in the new thread (to prevent more than one thread)
            cls._running = True

            cls.thread = threading.Thread(target=cls._run)
            cls.thread.daemon = daemon
            cls.thread.start()

    @classmethod
    def stop(cls):
        cls._running = False

    @classmethod
    def POW_accounts(cls, daemon=True):
        if not cls._running:
            cls.start(daemon=daemon)

        accounts_list = get_accounts()

        for account in accounts_list:
            rpc = nano.rpc.Client(account.wallet.node.IP)

            try:
                cls.logger.info('Enqueuing address: ' + account.address)
                frontier = rpc.frontiers(account=account.address, count=1)[account.address]
                POWService.enqueue_account(address=account.address, frontier=frontier)
            except Exception as e:
                cls.logger.error('Error getting hash for: ' + account.address)
        
        # If we are running this from the command, don't stop the main thread until we are done
        # TODO: There is an issue where the last account in the queue does not get saved into the database
        if not daemon:
            while not cls._pow_queue.empty():
                time.sleep(1)
            
            cls.stop()
            cls.thread.join()
                
