from .. import models
from ..common.retry import retry

def get_partners(enabled=True):
    """
    Get all advertisements in the database

    @return: Query of all Sponsors
    """
    return retry(lambda: models.Partner.objects.filter(enabled=enabled).all())
