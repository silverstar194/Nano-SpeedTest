from .. import models


def get_parners(enabled=True):
    """
    Get all advertisements in the database

    @return: Query of all Sponsors
    """
    return models.Partner.objects.filter(enabled=enabled).all()
