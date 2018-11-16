import random

from .. import models


def get_random_ad():
    """
    Get a random advertisement from the database

    @return: A random Advertisement from the database
    """
    ads = get_advertisements()

    if len(ads) != 0:
        return random.choice(ads)
    else:
        return ads


def get_advertisements():
    """
    Get all advertisements in the database

    @return: Query of all Advertisements
    """
    return models.Advertisement.objects.all()
