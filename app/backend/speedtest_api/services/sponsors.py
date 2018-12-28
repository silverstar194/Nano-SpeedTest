from .. import models


def get_sponsors(enabled=True):
    """
    Get all advertisements in the database

    @return: Query of all Sponsors
    """
    return models.Sponsor.objects.filter(enabled=enabled).all()