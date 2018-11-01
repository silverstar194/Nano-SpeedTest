from datetime import datetime
from datetime import timedelta

from django.http import JsonResponse
from rest_framework.decorators import api_view

from speedtest_api.models import Transaction
from speedtest_api.models import Account


@api_view(['POST'])
def send_transaction(request):
    """
    Send a transaction to the database

    Args:
        request: The REST request to the endpoint

    Returns:
        JsonResponse: The general transaction information as a JSON object

    """

    origin_node = {
        "id": 1,
        "latitude": 19.154428,
        "longitude": 72.849616,
    }

    destination_node = {
        "id": 2,
        "latitude": 37.794591,
        "longitude": -122.40412,
    }

    # Dummy JSON for the UI guys to test with
    transaction = {
        "id": 122,
        "origin": origin_node,
        "destination": destination_node,
        "amount": 1
    }

    output = {
        "transaction": transaction
    }

    return JsonResponse(output)


@api_view(['GET'])
def get_transaction(request):
    """
    Get a transaction from the database and return

    Args:
        request: The REST request to the endpoint

    Returns:
        JsonResponse: The transaction timing information as a JSON object

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
