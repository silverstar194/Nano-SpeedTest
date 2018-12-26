from speedtest_api import models
import sendgrid
from sendgrid.helpers.mail import *
import logging
import time

from django.conf import settings as settings

import nano

logger = logging.getLogger(__name__)


def node_status_job():
    '''
    Validates nodes are running and spam attack is not happening
    '''

    logger.info("Running node check...")
    nodes = models.Node.objects.filter(enabled=True)

    for node in nodes:
        try:
            nano.rpc.Client(node.URL).version()
        except Exception as e:

            from_email = Email("admin@NanoSpeed.live")
            to_email = Email(settings.ADMIN_EMAIL)
            subject = "URGENT: A node is down on NanoSpeed.live"
            text = """
              Hello Admin,

              Node %s in %s is down. Please investigate and restart.

              Best,
              NanoSpeed

              """ % (node.id, node.location_name)

            send_mail(to_email,from_email, subject, text)
            logger.info("Email sent to %s regarding crashed node %s in %s " % (settings.ADMIN_EMAIL, node.id, node.location_name))

    ###################################################################
    logger.info("Checking transactions generates for possible spam...")

    past_hours = []
    for i in range(2, 14):
        num_trans_past_ith_hour = models.Transaction.objects.filter(start_send_timestamp__gte=(1000 * int(time.time())) - i*60 * 60 * 1000).filter(start_send_timestamp__lte=(1000 * int(time.time())) - (i-1)*60 * 60 * 1000).count()
        past_hours.append(num_trans_past_ith_hour)

    count = len(past_hours)
    past_hours.sort()
    medium = sum(past_hours[int(count / 2 - 1):int(count / 2 + 1)]) / 2.0

    num_trans_past_hour = models.Transaction.objects.filter(start_send_timestamp__gte=(1000 * int(time.time())) - 60 * 60 * 1000).count()
    if num_trans_past_hour > medium*2:
        logger.info("Traffic doubled....")
        from_email = Email("admin@NanoSpeed.live")
        to_email = Email(settings.ADMIN_EMAIL)
        subject = "URGENT: A spam attack might be in progress on NanoSpeed.live"
        text = """
          Hello Admin,

          Traffic has doubled over the 12 hour medium. 
          
          Medium %s 
          Currently %s 
          
          You might want to check it out.

          Best,
          NanoSpeed

          """ % (medium, num_trans_past_hour)
        send_mail(to_email, from_email, subject, text)
        logger.info("Possible spam attack...")

def send_mail(to_email, from_email, subject, text):
    '''
    Handles sending out warning emails with SendGrid.
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