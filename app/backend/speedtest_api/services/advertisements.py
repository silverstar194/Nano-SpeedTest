import random

from .. import models


def get_random_ad():
    """
    Get a random advertisement from the database

    @return: A random advertisement from the database
    """
    ads = get_advertisements()
    return random.choice(ads)


def get_advertisements():
    """
    Get all advertisements in the database

    @return: Query of all advertisements
    """
    return models.Advertisement.objects.all()
