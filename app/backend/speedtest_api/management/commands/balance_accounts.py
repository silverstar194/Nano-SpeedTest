import logging
import time

from django.core.management.base import BaseCommand, CommandError
import nano

from ...models import *
from ...services import *


logger = logging.getLogger(__name__)

class BalancingException(Exception):
    def __init__(self):
        Exception.__init__(self, "Error occurred in the balance process.")

class Command(BaseCommand):
    help = "Balance all accounts in the database"

    def handle(self, *args, **options):
        """
        Balance all accounts in the database

        @raise BalancingException: Error occured in the balancing process
        """

        accounts_list = accounts.get_accounts()

        batch = batches.new_batch('Account balancer')

        # Small balances toward the 0 index
        accounts_sorted = sorted(accounts_list, key=lambda a: a.current_balance, reverse=False)

        values = list(map(lambda a: a.current_balance, accounts_sorted))

        # Use the average RAW value as the target
        mean = sum(values) // len(values)

        # Continue until we have only one unbalanced account
        while len(accounts_sorted) > 1:
            self.reduce_accounts(accounts_sorted, values, mean, batch)
            time.sleep(0.5)
    
    def reduce_accounts(self, accounts, values, mean, batch):
        """
        Reduce the list of accounts to balance by balancing two of the higher order accounts

        @param accounts: Ordered list of accounts that matches the ordering of values
        @param values: Ordered list of account balances that matches the ordering of accounts
        @param mean: Mean of account balances
        @raise BalancingException: Error occured in the balancing process
        """

        # Make sure everything checks out
        if len(accounts) < 2:
            return
        
        if len(accounts) != len(values):
            raise BalancingException()
        
        # Find lower and upper accounts that have POW
        lower = -1
        upper = len(values)

        found_lower = False
        found_upper = False

        # Find an account that needs a transaction and has valid POW (starting from the ends)
        while not found_lower:
            lower = lower + 1
            if lower >= upper:
                break
            
            if values[lower] == mean:
                del values[lower]
                del accounts[lower]
                upper = upper - 1
            rpc = nano.rpc.Client(accounts[lower].wallet.node.URL)
            
            # If the wallet is new, allow the balancing to happen
            try:
                address_nano = accounts[lower].address.replace("xrb", "nano")
                rpc.account_info(account=address_nano)
            except:
                found_lower = True
                logger.warning('Account is unopened: %s' % accounts[lower].address)
                break

            accounts[lower].refresh_from_db()

            found_lower = accounts[lower].POW is not None

        while not found_upper:
            upper = upper - 1
            if upper <= lower:
                break
            
            if values[upper] == mean:
                del values[upper]
                del accounts[upper]
                continue

            accounts[upper].refresh_from_db()
            
            found_upper = accounts[upper].POW is not None
        
        # If we can't do a transaction stop
        if not found_lower or not found_upper:
            return
        
        # Calculate the amount we want to send
        diff_lower = mean - values[lower]
        diff_upper = values[upper] - mean

        amount = min(diff_lower, diff_upper)

        if amount == 0:
            return

        # Create a transaction to balance the accounts
        try:
            transaction = transactions.new_transaction(accounts[upper], accounts[lower], amount, batch)
            transactions.send_transaction(transaction)
            logger.info('Balancing %s with %s amount %s' % (accounts[upper], accounts[lower], str(amount)))
        except Exception as e:
            logger.error('Transaction error: %s' % e)
            accounts[upper].unlock()
            accounts[lower].unlock()

            
        # Remove the accounts that got balanced (at least 1 did)
        if values[lower] + amount == mean:
            del values[lower]
            del accounts[lower]
            upper = upper - 1
        
        if values[upper] - amount == mean:
            del values[upper]
            del accounts[upper]
