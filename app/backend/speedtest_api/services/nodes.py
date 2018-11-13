from django.conf import settings as settings

from .. import models as models


def new_node(URL, latitude, longitude, location_name=None):
    """
    Create a new node from the given information

    @param URL: URL to connect to RPC of the node
    @param latitude: Latitude of the node
    @param longitude: Longitude of the node
    @param location_name: Friendly name of the node's location (256 character limit)
    @return: New node object
    """

    return models.Node.objects.create(URL=URL, latitude=latitude, longitude=longitude, location_name=location_name)

def get_nodes(enabled=True):
    """
    Get all nodes

    @param enabled: Filter nodes by enability.
    @return: Query of Node objects
    """

    return models.Node.objects.filter(enabled=enabled)

def get_node(id):
    """
    Get a node with the specified node.id

    @return: Node object or None if the node was not found
    @raise MultipleObjectsReturned: If more than one node with the Id is found, this is raised
    """

    try:
        return models.Node.objects.get(id=id)
    except models.Node.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        raise MultipleObjectsReturned()
