from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from speedtest_api.models import Transaction
from speedtest_api.serializers import TransactionSerializer

from datetime import datetime


@api_view(['POST'])
def send_transaction(request):
    """
    Send a transaction to the database
    """

    # Dummy JSON for the UI guys to test with
    transaction = {
        "origin": "123456789",
        "destination": "987654321",
        "start_timestamp": datetime.utcnow(),
        "end_timestamp": datetime.utcnow(),
        "amount": 13,
        "initiated_by": "192.168.0.1"
    }

    serializer = TransactionSerializer(data=transaction)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)