from decimal import *
import json

from django.http import JsonResponse
from rest_framework.decorators import api_view

from ipware import get_client_ip

from speedtest_api.services import advertisements
from speedtest_api.services import batches
from speedtest_api.services import transactions
from speedtest_api.services import nodes


@api_view(['POST'])
def generate_transaction(request):
    """
    Generate a new random transaction and return its basic information

    @param request The REST request to the endpoint
    @return JsonResponse The general transaction information including the id, wallets, wallet locations, amount, and ip

    """
    client_ip, is_routable = get_client_ip(request)
    body = json.loads(request.body)

    batch = batches.new_batch(client_ip)
    body_transactions = body['transactions']

    if len(body_transactions) == 0:
        return JsonResponse({'message': 'Must specify at least one transaction.'}, status=400)

    # If the first element in batch_transactions has null origin and destination nodes, generate random transactions
    # for each element in the array
    elif not body_transactions[0]['originNodeId'] and not body_transactions[0]['destinationNodeId']:
        transaction_array = []

        for transaction in body_transactions:
            # If any of the transactions have defined origin or destination node ids, throw a 400
            if transaction['originNodeId'] or transaction['destinationNodeId']:
                return JsonResponse({'message': "Transactions cannot be both random and defined."}, status=400)

            random_transaction = transactions.new_transaction_random(batch)

            transaction_array.append(convert_transaction_to_dict(random_transaction))

        batch_data = {
            'id': batch.id,
            'transactions': transaction_array
        }

        return JsonResponse(batch_data, status=200)

    # If the first element in batch_transactions has origin and destination node ids, generate transactions for each
    elif body_transactions[0]['originNodeId'] and body_transactions[0]['destinationNodeId']:
        transaction_array = []

        for transaction in body_transactions:
            # If any of the transactions have null origin or destination node ids, throw a 400
            if not transaction['originNodeId'] or not transaction['destinationNodeId']:
                return JsonResponse({'message': "Transactions cannot be both random and defined."}, status=400)

            elif transaction['originNodeId'] == transaction['destinationNodeId']:
                return JsonResponse({'message': "The origin and destination nodes cannot be the same."}, status=400)

            origin_node = nodes.get_node(transaction['originNodeId'])
            destination_node = nodes.get_node(transaction['destinationNodeId'])

            if origin_node is None:
                return JsonResponse({'message': "The originNodeId " + transaction['originNodeId'] + " was not found."}, status=404)

            if destination_node is None:
                return JsonResponse({'message': "The destinationNodeId " + transaction['destinationNodeId'] + " was not found."}, status=404)

            new_transaction = transactions.new_transaction_nodes(origin_node, destination_node, batch)

            transaction_array.append(convert_transaction_to_dict(new_transaction))

        batch_data = {
            'id': batch.id,
            'transactions': transaction_array
        }

        return JsonResponse(batch_data, status=200)

    else:
        return JsonResponse({'message': "The transaction format is invalid. Please try again."}, status=400)


@api_view(['POST'])
def send_batch_transactions(request):
    """
    Send the batch transactions specified in the request body

    @param request The REST request to the endpoint
    @return JsonResponse The transaction timing information

    """
    body = json.loads(request.body)

    batch_id = body['id']
    batch = batches.get_batch(batch_id)

    if batch is None:
        return JsonResponse({'message': 'Batch ' + str(batch_id) + ' not found.'}, status=404)

    # TODO verify each batch, not transaction, then send - need services to support this
    elif transaction.start_send_timestamp or transaction.transaction_hash_sending:
        return JsonResponse({'message': 'Transaction ' + str(transaction_id) + ' has already been sent.'}, status=403)

    else:
        sent_transaction = transactions.send_transaction(transaction)

        transaction_stats = {
            'id': sent_transaction.id,
            'startSendTimestamp': sent_transaction.start_send_timestamp,
            'endSendTimestamp': sent_transaction.end_send_timestamp,
            'startReceiveTimestamp': sent_transaction.start_receive_timestamp,
            'endReceiveTimestamp': sent_transaction.end_receive_timestamp
        }

        return JsonResponse(transaction_stats, status=200)


@api_view(['GET'])
def get_random_advertisement(request):
    """
    Get a random ad from the database

    @param request The REST request to the endpoint
    @return JsonResponse The ad to be displayed

    """
    random_ad = advertisements.get_random_ad()

    ad = {
        'title': random_ad.title,
        'message': random_ad.message,
        'url': random_ad.URL
    }

    return JsonResponse(ad, status=200)


@api_view(['GET'])
def list_nodes(request):
    """
    Get a list of all nodes from the database

    @param request The REST request to the endpoint
    @return JsonResponse An array of nodes

    """
    nodes_array = []
    all_nodes = nodes.get_nodes()

    for node in all_nodes:
        temp_node = {
            'id': node.id,
            'location': node.location_name,
            'latitude': node.latitude,
            'longitude': node.longitude
        }

        nodes_array.append(temp_node)

    node_dict = {
        'nodes': nodes_array
    }

    return JsonResponse(node_dict, status=200)


def convert_transaction_to_dict(transaction):
    """
    Private helper method to convert a transaction database query object to a dict

    @param transaction The transaction database query object
    @return dict A dictionary representation of the transaction

    """
    origin_node = transaction.origin.wallet.node
    destination_node = transaction.destination.wallet.node

    origin = {
        'id': origin_node.id,
        'nodeLocation': origin_node.location_name,
        'latitude': origin_node.latitude,
        'longitude': origin_node.longitude
    }

    destination = {
        'id': destination_node.id,
        'nodeLocation': destination_node.location_name,
        'latitude': destination_node.latitude,
        'longitude': destination_node.longitude
    }

    #  Convert from RAW to nano and round to four decimal places
    amount_decimal = Decimal(transaction.amount) / Decimal(1e24)
    amount = round(amount_decimal, 4)

    converted_transaction = {
        "id": transaction.id,
        "origin": origin,
        "destination": destination,
        "amount": amount
    }

    return converted_transaction
