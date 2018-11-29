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


logger = logging.getLogger(__name__)

class POWService:
    _pow_queue = queue.Queue()
    _running = False
    loop = None
    thread = None

    @classmethod
    def get_pow(cls, address, hash):
        """
        Get a POW, first try the dPoW, on failure, use a node

        @param address: Address for node lookup
        @param hash: Hash to generate PoW for
        @return: POW as a string
        @raise RPCException: RPC Failure
        """
        try:
            return cls._get_dpow(hash)['work']
        except Exception as e:
            logger.error('dPoW failure: %s' % e)
        
        account = get_account(address=address)
        rpc_node = nano.rpc.Client(account.wallet.node.URL)
        POW = None

        for i in range(3):
            try:
                POW = rpc_node.work_generate(hash)
                break
            except Exception as e:
                logger.error('Node work_generate error: %s' % e)
            
        if POW is None:
            raise Exception()

        return POW

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
                # Multi-thread this worker (our POW generation time must be less than transaction period)
                while not cls._pow_queue.empty():
                    try:
                        address, frontier = cls._pow_queue.get()

                        account = get_account(address=address)
                        account.POW = cls.get_pow(address=address, hash=frontier)

                        logger.info('Generated POW: %s for account %s' % (account.POW, account.address))

                        # Also calls save()
                        account.unlock()
                    except Exception as e:
                        logger.error('Exception in POW thread: ' + e)
                
                # Run this every second
                time.sleep(1)
        except Exception as e:
            logger.error(e)
            print(e)

    @classmethod
    def enqueue_account(cls, address, frontier):
        """
        Add an address, hash pair to the queue for POW generation (this will update the account object)

        @param address: Account address to generate POW for
        @param frontier: Frontier block to generate valid POW
        """

        cls._pow_queue.put((address, frontier))
    
    @classmethod
    def start(cls, daemon=True):
        """
        Start the POW processing thread

        @param daemon: Determines whether or not the thread will force close with the main process
        """

        if not cls._running:
            # Use a condition to wait until this value is set to True and set it in the new thread (to prevent more than one thread)
            cls._running = True

            logger.info('Starting PoW thread.')

            cls.thread = threading.Thread(target=cls._run)
            cls.thread.daemon = daemon
            cls.thread.start()

    @classmethod
    def stop(cls):
        """
        Stops the POW processing thread
        """

        logger.info('Stopping PoW thread.')

        cls._running = False

    @classmethod
    def POW_accounts(cls, daemon=True):
        """
        Generate POW for all accounts.
        If daemon is false, this method will wait for all POWs to be processed and saved

        @param daemon: Pass through to POWService.start(daemon)
        @raise RPCException: RPC Failure
        """

        if not cls._running:
            cls.start(daemon=daemon)

        accounts_list = get_accounts()

        for account in accounts_list:
            rpc = nano.rpc.Client(account.wallet.node.URL)

            try:
                frontier = rpc.frontiers(account=account.address, count=1)[account.address]

                if account.POW is None or not rpc.work_validate(work=account.POW, hash=frontier):
                    logger.info('Enqueuing address: ' + account.address)
                    POWService.enqueue_account(address=account.address, frontier=frontier)
            except Exception as e:
                logger.error('Error getting hash for: ' + account.address)
        
        # If we are running this from the command, don't stop the main thread until we are done
        if not daemon:
            while not cls._pow_queue.empty():
                time.sleep(1)
            
            cls.stop()
            cls.thread.join()
                
