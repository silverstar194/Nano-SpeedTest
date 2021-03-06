from decimal import *
import json
from threading import Thread
import random
import re
import logging
import time
from queue import Queue


from django.db.models import F
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from djqscsv import render_to_csv_response
from django.conf import settings as settings
from rest_framework.decorators import api_view
from django.core.cache import cache

from ipware import get_client_ip
from ratelimit.decorators import ratelimit

from speedtest_api.models import Transaction


from speedtest_api.services import advertisements
from speedtest_api.services import batches
from speedtest_api.services import transactions
from speedtest_api.services import partners
from speedtest_api.services import nodes

logger = logging.getLogger(__name__)

#@ratelimit(key='ip', rate='7/h')
@api_view(['POST'])
@csrf_exempt
def generate_transaction(request):
    
    """
    Generate a new random transaction and return its basic information

    @param request The REST request to the endpoint
    @return JsonResponse The general transaction information including the id, wallets, wallet locations, amount, and ip

    """
    was_limited = getattr(request, 'limited', False)
    if was_limited:
        logger.info("Request was limited for %s" % request.META.get('REMOTE_ADDR'))
        return JsonResponse({'message': "You reached the max number of requests per day. Try again tomorrow."},
                            status=403)

    client_ip, is_routable = get_client_ip(request)
    try:
        body = json.loads(request.body)
    except Exception as e:
        return JsonResponse({'message': "You must include a body with valid JSON."},
                            status=400)

    batch = batches.new_batch(client_ip)
    body_transactions = body['transactions']

    if len(body_transactions) == 0:
        return JsonResponse({'message': 'Must specify at least one transaction.'}, status=400)

    elif len(body_transactions) > 3:
        return JsonResponse({'message': 'You cannot send more than 3 transactions at once.'}, status=400)

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
                return JsonResponse({'message': "The originNodeId " + transaction['originNodeId'] +
                                                " was not found."}, status=404)

            if destination_node is None:
                return JsonResponse({'message': "The destinationNodeId " + transaction['destinationNodeId'] +
                                                " was not found."}, status=404)

            new_transaction = transactions.new_transaction_nodes(origin_node, destination_node, batch)

            transaction_array.append(convert_transaction_to_dict(new_transaction))

        batch_data = {
            'id': batch.id,
            'transactions': transaction_array
        }

        return JsonResponse(batch_data, status=200)

    else:
        return JsonResponse({'message': "The transaction format is invalid. Please try again."}, status=400)


#@ratelimit(key='ip', rate='7/h')
@api_view(['POST'])
@csrf_exempt
def send_batch_transactions(request):
    """
    Send the batch transactions specified in the request body

    @param request The REST request to the endpoint
    @return JsonResponse The transaction timing information

    """
    was_limited = getattr(request, 'limited', False)
    if was_limited:
        logger.info("Request was limited for %s" % request.META.get('REMOTE_ADDR'))
        return JsonResponse({'message': "You reached the max number of requests per day. Try again tomorrow."},
                            status=403)

    body = json.loads(request.body)

    batch_id = body['id']
    batch = batches.get_batch(batch_id)

    if not batch:
        return JsonResponse({'message': 'Batch ' + str(batch_id) + ' not found.'}, status=404)

    else:
        count = 0 ## Must retry here to take threading and database lag into account
        transactions_queue = Queue()
        while not len(list(transactions_queue.queue)) and count < 3:
            count += 1
            batch_transactions = transactions.get_transactions(enabled=True, batch=batch)

            all_threads = []
            for transaction in batch_transactions:
                if transaction.start_send_timestamp or transaction.end_receive_timestamp:
                    logger.info("This batch has already been sent.")
                    sent_batch = {
                        'id': batch_id,
                        'transactions': [convert_transaction_to_dict(transaction) for transaction in batch_transactions],
                    }
                    return JsonResponse(sent_batch, status=200)

                try:
                    thread = Thread(target=send_transaction_async, args=(transaction, transactions_queue))
                    thread.start()
                    all_threads.append(thread)
                except transactions.InvalidPOWException as e:
                    return JsonResponse({'message': "The transaction POW was invalid. Please try again."}, status=400)


            ## Wait on all transaction threads to complete
            for t in all_threads:
                t.join()

            if not len(list(transactions_queue.queue)):
                logger.error("Retrying batch %s" % (batch_id))
                time.sleep(1)


        if not len(list(transactions_queue.queue)):
            return JsonResponse({'message': "Please try again. No transactions generated."}, status=400)

        for transaction in list(transactions_queue.queue):
            # Sometimes the time is too low to be reasonable. 180ms is twice ping time and seems tolerable as a cut off
            # This can be caused by clocks across nodes and backend falling out of sync
            # or threading order of execution.
            # The below is a "catch all" sanitation to prevent unreliable times. Further investigation is under way.
            # Author: silverstar194
            # 3/6/2019
            if not transaction["endSendTimestamp"] or not transaction["startSendTimestamp"] or (int(transaction["endSendTimestamp"]) - int(transaction["startSendTimestamp"])) <= 180:
                logger.error("Negative timing error start %s end %s" % (str(transaction["startSendTimestamp"]), str(transaction["endSendTimestamp"])))
                return JsonResponse({'message': "Internal timing error."}, status=400)

        sent_batch = {
            'id': batch_id,
            'transactions': list(transactions_queue.queue),
        }

        return JsonResponse(sent_batch, status=200)


@api_view(['GET'])
def get_random_advertisement(request):
    """
    Get a random ad from the database

    @param request The REST request to the endpoint
    @return JsonResponse The ad to be displayed

    """
    random_ad = advertisements.get_random_ad()

    if random_ad:
        ad = {
            "ad":{
            'title': random_ad.title,
            'message': random_ad.description,
            'url': random_ad.URL
            }
        }

        return JsonResponse(ad, status=200)
    else:
        return JsonResponse({'message': "No advertisements were found."}, status=200)

@api_view(['POST'])
@csrf_exempt
def add_advertisement(request):
    """
    Post information for a new advertisement

    @param request The REST request to the endpoint
    @return JsonResponse The status of ad addition

    """
    body = json.loads(request.body)
    if 'ad' not in body:
        return JsonResponse({'message': "Please provide an ad."}, status=400)

    ad = body['ad']
    if not ('description' in ad and 'URL' in ad and 'title' in ad and 'email' in ad and 'tokens' in ad and 'company' in ad):
        return JsonResponse({'message': "Please provide all information for an ad."}, status=400)

    description = ad['description']
    URL = ad['URL']
    title = ad['title']
    company = ad['company']
    email = ad['email']

    try:
        tokens = int(ad['tokens'])
    except Exception:
        return JsonResponse({'message': "Tokens must be integer value."}, status=400)

    ad = advertisements.create_advertisement(title, description, URL, company, email, tokens, False)

    advertisements.email_admin_with_new_ad(ad)

    return JsonResponse({'message': "Success"}, status=200)

@api_view(['GET'])
def advertisement_information(request):
    """
    Get information about creating a new advertisement

    @param request The REST request to the endpoint
    @return JsonResponse The status of ad addition

    """
    data = {'current_cost_per_slot': settings.COST_PER_SLOT}

    return JsonResponse({'data': data}, status=200)


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

    random.shuffle(nodes_array)

    node_dict = {
        'nodes': nodes_array
    }

    return JsonResponse(node_dict, status=200)


@api_view(['GET'])
def get_transaction_statistics(request):
    """
    Gets statistics from the most recent number of transactions specified in the body

    @param request The number of transactions to return
    @return dict An array of transactions with average timing and total count metadata

    """
    if not request.GET.get('count'):
        return JsonResponse({"error" : "Please provide number of transactions."}, status=400)

    count = request.GET.get('count')
    transactions_array = []
    recent_transactions = transactions.get_recent_transactions(int(count))

    for transaction in recent_transactions:
        temp_transaction = convert_transaction_to_dict(transaction)
        transactions_array.append(temp_transaction)

    # Sometimes the time is too low to be reasonable.
    # This can be caused by clocks across nodes and backend falling out of sync
    # or threading order of execution.
    # The below is a "catch all" sanitation to prevent unreliable times. Further investigation is under way.
    # Author: silverstar194
    # 3/6/2019
    difference_set = Transaction.objects.filter(end_send_timestamp__gt=(F('start_send_timestamp')+180)).filter(start_send_timestamp__gte=int(round(time.time() * 1000))-(24*60*60*1000)).annotate(difference=(F('end_send_timestamp') - F('start_send_timestamp')))
    median_delta, count = median_value(difference_set, "difference")

    transaction_count = Transaction.objects.filter(start_send_timestamp__gte=0).filter(end_send_timestamp__gt=(F('start_send_timestamp')+180)).count()

    statistics = {
        'transactions': transactions_array,
        'count': transaction_count,
        'average': median_delta
    }

    return JsonResponse(statistics, status=200)

@api_view(['GET'])
def get_medians(request):

    times = [1, 24, 7*24, 30*24, 365*24]
    times_str = ["1h_median", "24h_median", "1w_median", "1m_median", "1y_median"]
    count_str = ["1h_count", "24h_count", "1w_count", "1m_count", "1y_count"]
    statistics = {}

    for i in range(len(times)):
        difference_set = Transaction.objects.filter(end_send_timestamp__gt=(F('start_send_timestamp')+180)).filter(start_send_timestamp__gte=int(round(time.time() * 1000))-(times[i]*60*60*1000)).annotate(difference=(F('end_send_timestamp') - F('start_send_timestamp')))
        median_delta, count = median_value(difference_set, "difference")
        statistics[times_str[i]] = median_delta
        statistics[count_str[i]] = count

    return JsonResponse(statistics, status=200)

@api_view(['GET'])
def get_partners(request):
    partners_all = partners.get_partners()

    titles = []
    texts = []
    links = []
    imgs = []
    for partner in partners_all:
        titles.append(partner.title)
        texts.append(partner.text)
        links.append(partner.link)
        imgs.append(partner.img)

    c = list(zip(titles, texts, links, imgs))
    random.shuffle(c)
    titles, texts, links, imgs = zip(*c)

    data = {
        'gold':{
            'title': titles,
            'text': texts,
            'link': links,
            'img': imgs,
        }
    }


    return JsonResponse({'data': data}, status=200)

@api_view(['GET'])
def download_transaction(request):
    qs = transactions.get_transactions(download=True)
    return render_to_csv_response(qs)


@api_view(['POST'])
@csrf_exempt
def callback(request):
    try:
        body = json.loads(request.body)
        client_ip, is_routable = get_client_ip(request)

        cache_key = body["hash"]+"_"+client_ip  # needs to be unique
        cache_time = 30  # time in seconds for cache to be valid

        end_time = int(round(time.time() * 1000)) ## end time
        cache.set(cache_key, end_time, cache_time)

    except Exception as e:
        return JsonResponse({'message': str(e.message)},
                            status=400)

    return JsonResponse({}, status=200)

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

    # Convert from RAW to nano and round to four decimal places
    amount_decimal = Decimal(transaction.amount) / Decimal(1e24)
    amount = round(amount_decimal, 4)

    ##catch 0000 response from node
    if re.match("^[0]+$", transaction.transaction_hash_receiving):
        output_rec = ""
    else:
        output_rec = transaction.transaction_hash_receiving

    converted_transaction = {
        "id": transaction.id,
        "transactionHashSending": transaction.transaction_hash_sending,
        "transactionHashReceiving": output_rec,
        "origin": origin,
        "destination": destination,
        "amount": amount,
        "startSendTimestamp": transaction.start_send_timestamp,
        "endSendTimestamp": transaction.end_send_timestamp,
        "startReceiveTimestamp": transaction.start_receive_timestamp,
        "endReceiveTimestamp": transaction.end_receive_timestamp,
        "PoWCached": transaction.PoW_cached_send,
        "bias_send": transaction.bias_send,
        "bias_receive": transaction.bias_receive,
        "node_send_bias": transaction.node_send_bias,
        "node_lag": transaction.node_lag,
        "PoW_cached_send": transaction.PoW_cached_send,
        "work_send": transaction.POW_send,
        "work_receive":transaction.POW_receive,
    }

    return converted_transaction

def send_transaction_async(transaction, out_queue):
    """
    Private helper method to allow async transactions

    @param transaction The transaction database query object
    @param out_queue Queue to store transaction once finished

    """
    transaction_async = transactions.send_transaction(transaction)
    out_queue.put(convert_transaction_to_dict(transaction_async))

def median_value(queryset, term):
    count = queryset.count()
    values = queryset.values_list(term, flat=True).order_by(term)
    if count % 2 == 1:
        return (int(values[int(round(count/2))]), count)
    else:
        return (int(sum(values[count/2-1:count/2+1])/Decimal(2.0)), count)
