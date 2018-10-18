# Copied over from DjangoREST tutorial
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from speedtest_api.models.models import Transaction
from speedtest_api.serializers import TransactionSerializer
from datetime import datetime

@api_view(['POST'])
def send_transaction():
    """
    Send a transaction to the database
    """
    transaction = Transaction()
    transaction.ID = '000000000'
    transaction.SenderID = '123456789'
    transaction.ReceiverID = '987654321'
    transaction.StartTime = datetime.utcnow()
    transaction.EndTime = datetime.utcnow()
    transaction.Amount = 0.00001
    transaction.InitiatorIP = '192.168.1.1'

    serializer = TransactionSerializer(data=transaction)
    if serializer.is_valid():
        # serializer.save
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
