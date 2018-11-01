from datetime import datetime
from datetime import timedelta

from django.http import JsonResponse
from rest_framework.decorators import api_view

from speedtest_api.models import Transaction
from speedtest_api.models import Account
from speedtest_api.services import transactions

from ipware import get_client_ip

@api_view(['POST'])
def send_transaction(request):
    """
    Send a transaction to the database

    @param request The REST request to the endpoint
    @return JsonResponse The general transaction information as a JSON object

    """

    client_ip, is_routable = get_client_ip(request)

    transaction = transactions.send_transaction(client_ip)
    origin_node = transaction.origin
    destination_node = transaction.destination
    amount = transaction.amount

    random_transaction = {
        "id": transaction.id,
        "origin": origin_node,
        "destination": destination_node,
        "amount": amount,
        "ip": client_ip
    }

    return JsonResponse(random_transaction)


@api_view(['GET'])
def get_transaction(request):
    """
    Get a transaction from the database and return

    @param request The REST request to the endpoint
    @return JsonResponse The transaction timing information as a JSON object

    """

    # Dummy JSON for the UI guys to test with
    start_datetime = datetime.utcnow().timestamp() * 1000  # Convert to millisecond Unix time
    end_datetime = start_datetime + 10000  # Add ten seconds

    transaction_stats = {
        "id": 122,
        "start_timestamp": int(start_datetime),
        "end_timestamp": int(end_datetime)
    }

    transaction_id = int(request.GET.get('id'))

    if transaction_id != 122:
        return JsonResponse({"message": "Transaction not found."}, status=404)
    else:
        return JsonResponse(transaction_stats)
