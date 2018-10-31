from django.shortcuts import render
import json
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from speedtest_api.models import Transaction
from speedtest_api.models import Account

from speedtest_api.serializers import TransactionSerializer

from datetime import datetime


@api_view(['POST'])
def send_transaction(request):
    """
    Send a transaction to the database
    """

    # Dummy JSON for the UI guys to test with
    transaction = {
        "origin": 1,
        "destination": 2,
        "start_timestamp": str(datetime.utcnow()),
        "end_timestamp": str(datetime.utcnow()),
        "amount": 1,
        "initiated_by": "192.168.0.1",
        "transaction_hash_sending": 0,
        "transaction_hash_receiving": 0
    }

    node = {
        "lat":12,
        "long":12,
    }

    output = {
        "transaction": transaction,
        "node": node
    }


    return JsonResponse(output)

    #serializer = TransactionSerializer(data=transaction)

    #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)