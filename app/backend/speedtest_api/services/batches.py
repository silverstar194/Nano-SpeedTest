from ..common.retry import retry
from .. import models as models


def new_batch(initiated_by):
    """
    Create a new batch from the given information

    @param initiated_by: IP that initiated the batch
    @return: New batch object
    """

    return retry(lambda: models.Batch.objects.create(initiated_by=initiated_by))

def get_batches():
    """
    Get all batches in the database

    @return: Query of all batches
    """

    return retry(lambda: models.Batch.objects.all())

def get_batch(id):
    """
    Get a batch by id

    @param id: The batch id
    @return: None if there is no Batch with that id or a Batch object
    @raise MultipleObjectsReturned: If more than one batch has the id given, this will be raised
    """

    try:
        return retry(lambda: models.Batch.objects.get(id=id))
    except models.Batch.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        raise MultipleObjectsReturned()
