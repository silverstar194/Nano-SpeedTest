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

    client_ip = get_client_ip(request)

    transaction = transactions.new_transaction(client_ip)
    origin_node = transaction.origin
    destination_node = transaction.destination

    origin = {
        'id': origin_node.id,
        'latitude': origin_node.latitude,
        'longitude': origin_node.longitude
    }

    destination = {
        'id': destination_node.id,
        'latitude': destination_node.latitude,
        'longitude': destination_node.longitude
    }

    random_transaction = {
        "id": transaction.id,
        "origin": origin,
        "destination": destination,
        "amount": transaction.amount,
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

    transaction_id = int(request.GET.get('id'))

    try:
        transaction = transactions.get_transaction(transaction_id)
    except Exception:  # Make this the more specific MultipleObjectsReturned exception once it is implemented
        # Return 500 until better option is developed
        return JsonResponse({'message': 'Multiple transactions returned for ' + str(transaction_id) + '.'}, status=500)
    else:
        if transaction is None:
            return JsonResponse({'message': 'Transaction ' + str(transaction_id) + ' not found.'}, status=404)

    transaction_stats = transactions.send_transaction(transaction)

    return JsonResponse({'transaction': transaction_stats}, status=404)
