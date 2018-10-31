from django.shortcuts import render
import json
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from speedtest_api.models import Transaction
from speedtest_api.models import Account

from datetime import datetime
from datetime import timedelta


@api_view(['POST'])
def send_transaction(request):
    """
    Send a transaction to the database
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
    Send a transaction from the database
    """

    start_datetime = datetime.utcnow()
    end_datetime = start_datetime + timedelta(seconds=10)

    transaction_stats = {
        "id": 122,
        "start_timestamp": str(start_datetime),
        "end_timestamp": str(end_datetime)
    }

    transaction_id = int(request.GET.get('id'))

    if transaction_id != 122:
        return JsonResponse({'success':'false', 'message': "Transaction not found."}, status=404)
    else:
        return JsonResponse(transaction_stats)
