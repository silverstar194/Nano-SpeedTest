import random

from .. import models


def get_random_ad():
    """
    Get a random advertisement from the database with uneven probs. using Lahiri's Method

    @return: A random Advertisement from the database based on token weight
    """

    ads = get_advertisements()
    max_tokens = 0
    for a in ads:
        if a.tokens > max_tokens:
            max_tokens = a.tokens

    while True:
        random_m = random.randint(1,max_tokens)
        ad = random.choice(ads)
        if random_m < ad.tokens:
            return ad

def get_advertisements():
    """
    Get all advertisements in the database

    @return: Query of all Advertisements
    """
    return models.Advertisement.objects.all()
