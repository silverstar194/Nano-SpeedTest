import time

from django.core.management.base import BaseCommand, CommandError

from ../../models import *
from ../../services import *


class BalancingException(Exception):
    def __init__(self):
        Exception.__init__(self, "Error occurred in the balance process.")

class Command(BaseCommand):
    def handle(self, *args, **options):
        accounts = get_accounts()

        # Small balances toward the 0 index
        accounts_sorted = sorted(accounts, key=lambda a: a.current_balance, reverse=False)

        values = map(lambda a: a.current_balance, accounts_sorted)
        mean = sum(values) // len(values)

        while len(accounts_sorted) > 1:
            reduce_accounts(accounts_sorted, values, mean)
            time.sleep(0.1)
    
    def reduce_accounts(accounts, values, mean):
        if len(accounts) < 2:
            return
        
        if len(accounts) != len(values):
            raise BalancingException()
        
        if values[0] == mean:
            del values[0]
            del accounts[0]
        
        if values[len(values) - 1] == mean:
            del values[len(values) - 1]
            del accounts[len(values) - 1]
        
        # Find lower and upper accounts that have POW
        lower = 0
        upper = len(values) - 1

        found_lower = accounts[lower].POW is not None
        found_upper = accounts[upper].POW is not None

        while not found_lower:
            lower = lower + 1
            if lower >= upper:
                break
            
            found_lower = accounts[lower].POW is not None

        while not found_upper:
            upper = upper - 1
            if upper <= lower:
                break
            
            found_upper = accounts[upper].POW is not None
        
        if not found_lower or not found_upper:
            return
        
        diff_lower = mean - values[lower]
        diff_upper = values[upper] - mean

        amount = min(diff_lower, diff_upper)

        # Create a transaction to balance the accounts
        # TODO: Handle errors
        transaction = new_transaction(accounts[upper], accounts[lower], amount, 'Account Balancer')
        send_transaction(transaction)

        # Remove the accounts that got balanced (at least 1 did)
        if values[lower] + amount == mean:
            del values[lower]
            del accounts[lower]
        
        if values[upper] - amount == mean:
            del values[upper]
            del accounts[upper]
