from operator import itemgetter
import logging
import queue
import requests
from multiprocessing.pool import ThreadPool
import time
import threading

from django.conf import settings as settings
import nano

from .. import models as models



logger = logging.getLogger(__name__)

class POWService:
    _pow_queue = queue.Queue()
    _running = False
    thread_pool = None
    loop = None
    thread = None

    @classmethod
    def in_queue(cls, address):
        temp_queue = cls.queue_to_list()
        for item in temp_queue:
            if item[0] == address:
                return True
        return False

    @classmethod
    def put_account(cls, data, urgent):
        if urgent:
            in_time = 0
        else:
            in_time = int(round(time.time() * 1000))
        cls._pow_queue.put((data, in_time))

    @classmethod
    def get_account(cls):
        from .accounts import number_accounts
        temp_queue = cls.queue_to_list()
        temp_queue = sorted(temp_queue, key=itemgetter(1))

        ## High load
        if len(temp_queue) >= number_accounts() / 10:
            logger.error("High load dPoW call queue length %s" % len(temp_queue))
            copy_queue = queue.Queue()
            [copy_queue.put(i) for i in temp_queue[1:]]
            cls._pow_queue = copy_queue
            return temp_queue[0][0]

        head = temp_queue[0]
        if head[1] + 30*1000 <= int(round(time.time() * 1000)): # 30 sec. wait
            copy_queue = queue.Queue()
            [copy_queue.put(i) for i in temp_queue[1:]]
            cls._pow_queue = copy_queue
            return head[0]

    @classmethod
    def is_empty(cls):
        from .accounts import number_accounts
        temp_queue = cls.queue_to_list()
        temp_queue = sorted(temp_queue, key=itemgetter(1))

        if((len(temp_queue) > 0 and temp_queue[0][1] + 91*1000 <= int(round(time.time() * 1000))) or len(temp_queue) >= number_accounts() / 10): ## 61 to prevent thread issues
            return False
        return True

    @classmethod
    def queue_to_list(cls):
        temp_list = []
        for i in cls._pow_queue.queue: temp_list.append(i)
        return temp_list

    @classmethod
    def get_pow(cls, address, hash_value):
        """
        Get a POW, first try the dPoW, on failure, use a node

        @param address: Address for node lookup
        @param hash_value: Hash to generate PoW for
        @return: POW as a string
        @raise RPCException: RPC Failure
        """
        from .accounts import get_account
        account = get_account(address=address)

        for i in range(5):
            try:
                POW = cls._get_dpow(hash_value)['work']
                if POW:
                    return POW
            except Exception as e:
                logger.exception('dPoW failure for hash %s: %s try %s of 4' % (hash_value, str(e), i))
                if i == 4:
                    logger.error('dPoW failure account %s' % address)
            time.sleep(.5)

        ## Moved PoW to nodes as work peers
        # for i in range(5):
        #     try:
        #         POW = rpc_node.work_generate(hash)
        #         break
        #     except Exception as e:
        #         logger.error('Node work_generate error: %s try %s of 4' % (e, i))
        #         time.sleep(30)
        #         if i == 4:
        #             logger.error('dPoW failure account %s unlocked without PoW' % address)
        #             account.unlock()
        
        # Add third POW that cannot fail (if it does our account object becomes broken)

        if POW is None:
            account.unlock()
            logger.error('dPoW get failure account %s unlocked without PoW' % address)
            raise Exception()

        return POW

    @classmethod
    def _get_dpow(cls, hash_value):
        """
        Generate a PoW using the distributed endpoint.

        @param hash_value: Hash to generate PoW for
        @return: Json object containing a work property
        @raise httpError: Can't connect to dPoW, or dPoW timed out
        """
        data = {
            "user": settings.DPOW_API_USER,
            "api_key": settings.DPOW_API_KEY,
            "multiplier": 4.0, ##4x base
            "hash": hash_value,
        }
        res = requests.post(url=settings.DPOW_ENDPOINT, json=data, timeout=15)
        logger.info('dPoW Status %s %s' % (res.status_code, res.json()))

        if res.status_code == 200:
            return res.json()
        else:
            logger.error('dPoW Status %s %s' % (res.status_code, res.json()))
            raise Exception()

    @classmethod
    def _run(cls):

        try:
            while cls._running:
                while not cls.is_empty():
                    from .accounts import get_account
                    address, frontier = cls.get_account()
                    try:
                        account = get_account(address=address)
                        account.POW = cls.get_pow(address=address, hash_value=frontier)
                        logger.info('Generated POW: %s for account %s' % (account.POW, account))
                        time.sleep(.5)  ## Don't spam dPoW

                        account.save()
                        account.unlock()
                    except Exception as e:
                        logger.error('Exception in POW thread: %s ' % e)
                        logger.error('dPoW failure account %s unlocked without PoW' % address)
                        account.unlock()  ## Prevent leaks

                # Run this every second
                time.sleep(.1)
        except Exception as e:
            logger.error('dPoW failure account %s' % e)
            logger.error("Error in _run PoW address")


    @classmethod
    def enqueue_account(cls, address, frontier, urgent=False):
        """
        Add an address, hash pair to the queue for POW generation (this will update the account object)

        @param address: Account address to generate POW for
        @param frontier: Frontier block to generate valid POW
        """
        from .accounts import get_account
        logger.info('Enqueuing address %s frontier %s urgent %s' % (address, frontier, urgent))
        get_account(address=address).lock()
        cls.put_account((address, frontier), urgent)

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

            cls.thread_pool = ThreadPool(processes=4)
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
    def POW_account_thread_asyc(cls, account, urgent=False):
        from .accounts import validate_PoW

        valid = validate_PoW(account)
        logger.info('Validating dPoW on account %s as %s' % (account.address, valid))

        if not valid:
            try:
                rpc = nano.rpc.Client(account.wallet.node.URL)
                address_nano = account.address.replace("xrb", "nano")
                frontier = rpc.frontiers(account=account.address, count=1)[address_nano]
                POWService.enqueue_account(address=account.address, frontier=frontier, urgent=urgent)
                logger.info('Generating PoW on start up address %s frontier %s urgent %s' % (account.address, frontier, urgent))
            except Exception as e:
                logger.error('Account %s dPoW enqueuing error %s' % str(e))

    @classmethod
    def POW_accounts(cls, daemon=True):
        """
        Generate POW for all accounts.
        If daemon is false, this method will wait for all POWs to be processed and saved

        @param daemon: Pass through to POWService.start(daemon)
         @raise RPCException: RPC Failure
        """
        from .accounts import get_accounts

        if not cls._running:
            cls.start(daemon=daemon)

        accounts_list = get_accounts() ## Locking should be done properly here

        for account in accounts_list:
            if not cls.in_queue(account):
                cls.thread_pool.apply_async(cls.POW_account_thread_asyc, (account, True,))
            else:
                logger.error('account %s dPoW already in queue' % account.address)
        
        # If we are running this from the command, don't stop the main thread until we are done
        if not daemon:
            cls.thread_pool.close()
            cls.thread_pool.join()

            while not cls.is_empty():
                time.sleep(.1)
            
            cls.stop()
            cls.thread.join()

