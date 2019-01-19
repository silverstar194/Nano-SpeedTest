import json
import logging
import random
import time
from multiprocessing.dummy import Pool as ThreadPool

import numpy
import requests
import sendgrid
from django.conf import settings as settings
from sendgrid.helpers.mail import *

from .services import models

logger = logging.getLogger(__name__)


class TransactionGenerator:
    def __init__(self, nodes):
        self.nodes = nodes

    def generate(self, number):
        transactions = []
        for i in range(0, number):
            random.shuffle(self.nodes)
            transactions.append('{"transactions":[{"originNodeId":%s,"destinationNodeId":%s}]}' \
                                % (self.nodes[0].id, self.nodes[1].id))
        return transactions

    def parse_ids(self, response):
        transactions_ids = []
        for r in response:
            transactions_ids.append('{"id":%s}' % json.loads(r)['id'])
        return transactions_ids


class LoadTester:
    API_ENDPOINT = None

    def __init__(self, API_ENDPOINT):
        self.API_ENDPOINT = API_ENDPOINT

    def load_test_get(self, route, threads=30, hits=20):
        pool = ThreadPool(threads)
        urls = [route] * hits
        results = pool.map(self.send_get, urls)
        self.verify_response(results, route)
        pool.close()
        pool.join()

    def load_test_post(self, route, data, threads=30):
        pool = ThreadPool(threads)
        urls = [route] * len(data)
        job_args = [(urls[i], data[i]) for i in range(len(data))]
        results = pool.map(self.send_post, job_args)
        self.verify_response(results, route)
        pool.close()
        pool.join()
        data = []
        for r in results:
            if r[0].status_code == 200:
                data.append(r[0].text)
        return data

    def send_get(self, route):
        start = time.time()
        r = requests.get(url=self.API_ENDPOINT + route)
        end = time.time()
        return (r, end - start)

    def send_post(self, args):
        start = time.time()
        r = requests.post(url=self.API_ENDPOINT + args[0], data=args[1])
        end = time.time()
        return (r, end - start)

    def verify_response(self, results, route):
        passing = 0
        failing = 0
        times = []
        failures = []
        for d in results:
            response = d[0]
            times.append(d[1])
            failures = []
            if response.status_code is not 200:
                failures.append(response.text)
                failing += 1
            else:
                passing += 1

        if len(failures):
            body = "Dear Admin,"
            body += ("\n\n%s%s \n\n" % (self.API_ENDPOINT, route))
            body += ("Passing %s Failing %s \n\n" % (passing, failing))
            body += ("[Median %s Varience %s Max %s Min %s] \n\n" % (round(numpy.median(times) if len(times) else 0, 3), \
                                                                   round(numpy.var(times), 3),
                                                                   round(max(times) if len(times) else 0, 3),
                                                                   round(min(times) if len(times) else 0, 3)))

            from_email = Email("admin@NanoSpeed.live")
            to_email = Email(settings.ADMIN_EMAIL)
            subject = "URGENT: API Point %s%s is DOWN NanoSpeed.live" % (self.API_ENDPOINT, route)

            send_mail(to_email, from_email, subject, body)
            logger.info("Email sent to %s%s down API points %s " % (settings.ADMIN_EMAIL, self.API_ENDPOINT, route))


def transaction_test():
    '''
    Validates transaction can be generated and sent.
    '''

    loader = LoadTester("https://api.nanospeed.live/")

    # Test static API get routes
    loader.load_test_get("nodes/list", threads=1, hits=2)
    loader.load_test_get("header/info", threads=1, hits=2)
    loader.load_test_get("transactions/statistics?count=250", threads=1, hits=2)
    loader.load_test_get("header/random", threads=1, hits=2)

    # Test sending API post routes
    nodes = list(models.Node.objects.filter(enabled=True))
    trans_gen = TransactionGenerator(nodes)

    for i in range(0, 2):
        response_create = loader.load_test_post("transactions", trans_gen.generate(2), threads=2)
        loader.load_test_post("transactions/send", trans_gen.parse_ids(response_create), threads=2)
        time.sleep(10)


def send_mail(to_email, from_email, subject, text):
    '''
    Handles sending out warning emails with SendGrid.
    TODO: Put email into a service
    '''

    try:
        sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
    except Exception as e:
        logger.error("Error occurred connecting to sendgrid %s " % str(e))

    content = Content("text/plain", text)

    mail = Mail(from_email, subject, to_email, content)

    try:
        sg.client.mail.send.post(request_body=mail.get())
    except Exception as e:
        logger.error("Error occurred sending email with sendgrid %s " % str(e))
