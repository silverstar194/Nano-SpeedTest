from speedtest_api import models
import sendgrid
from sendgrid.helpers.mail import *
import logging

from django.conf import settings as settings

import nano

logger = logging.getLogger(__name__)


def node_status_job():
    nodes = models.Node.objects.filter(enabled=True)
    from_email = Email("admin@NanoSpeed.live")
    to_email = Email(settings.ADMIN_EMAIL)
    subject = "URGENT: A node is down on NanoSpeed.live"

    for node in nodes:
        if not nano.rpc.Client(node.URL).version():
            try:
                sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
            except Exception as e:
                logger.error("Error occurred connecting to sendgrid %s " % str(e))
                continue

            text = """
              Hello Admin,

              Node %s in %s is down. Please investigate and restart.

              Best,
              NanoSpeed

              """ % (node.id, node.location_name)

            content = Content("text/plain", text)

            mail = Mail(from_email, subject, to_email, content)

            try:
                sg.client.mail.send.post(request_body=mail.get())
            except Exception as e:
                logger.error("Error occurred sending email with sendgrid %s " % str(e))
