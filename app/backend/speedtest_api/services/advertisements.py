import random
import os
import logging

import sendgrid
from sendgrid.helpers.mail import *

from .. import models
from django.conf import settings as settings

logger = logging.getLogger(__name__)
def get_random_ad():
    """
    Get a random advertisement from the database with uneven probabilities using Lahiri's Method

    @return: A random Advertisement from the database based on token weight
    """

    ads = get_advertisements()
    max_tokens = 0
    for a in ads:
        if a.tokens > max_tokens:
            max_tokens = a.tokens

    while True:
        random_m = random.randint(1, max_tokens)
        ad = random.choice(ads)
        if random_m < ad.tokens:
            return ad

def get_advertisements():
    """
    Get all advertisements in the database

    @return: Query of all Advertisements
    """
    return models.Advertisement.objects.all()

def create_advertisement(title, description, URL, company, email, tokens):
    """
    Creates a new ad in database.

    @param title Ad title
    @param description Ad general text to go in ad
    @param URL Link for ad
    @param company Company placing ad
    @param email Company contact email
    @param tokens slots allocated for ad
    @return: Query of all Advertisements
    """
    ad = models.Advertisement.objects.create(title=title,
                                             description=description,
                                             URL=URL,
                                             company=company,
                                             email=email,
                                             tokens=tokens)
    return ad

def email_admin_with_new_ad(ad):
    try:
        sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
    except Exception as e:
        logger.error("Error occurred connecting to sendgrid %s " % str(e))


    from_email = Email("admin@NanoSpeed.live")
    to_email = Email(settings.ADMIN_EMAIL)

    subject = "NanoSpeed: New Ad Submited from %s " % ad.company
    text = """
              Hello Admin,
              
              Looks like you have a new ad lead from %s. They want to post using %s tokens:
              
              %s | %s | %s.
              
              Email them back at %s.
              
              Best,
              NanoSpeed
              
              """ % (ad.company, ad.tokens, ad.title, ad.description, ad.URL, ad.email)

    content = Content("text/plain", text)

    mail = Mail(from_email, subject, to_email, content)

    try:
        response = sg.client.mail.send.post(request_body=mail.get())
    except Exception as e:
        logger.error("Error occurred sending email with sendgrid %s " % str(e))

    logger.info("Email sent to %s to_email regarding %s " % (from_email, ad.company))

    return response
