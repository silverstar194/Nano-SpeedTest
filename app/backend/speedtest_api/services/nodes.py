from .. import models as models
from ..common.retry import retry


class NodeNotFoundException(Exception):
    def __init__(self, node):
        Exception.__init__(self, "Fatal error occurred occurred. Node %s not found." % (node.URL))

def new_node(URL, latitude, longitude, location_name=None):
    """
    Create a new node from the given information

    @param URL: URL to connect to RPC of the node
    @param latitude: Latitude of the node
    @param longitude: Longitude of the node
    @param location_name: Friendly name of the node's location (256 character limit)
    @return: New node object
    """

    return retry(lambda: models.Node.objects.create(URL=URL, latitude=latitude, longitude=longitude, location_name=location_name))

def get_nodes(enabled=True):
    """
    Get all nodes

    @param enabled: Filter nodes by enability.
    @return: Query of Node objects
    """

    return retry(lambda: models.Node.objects.filter(enabled=enabled))

def get_node(id, enabled=True):
    """
    Get a node with the specified node.id

    @return: Node object or None if the node was not found
    @raise MultipleObjectsReturned: If more than one node with the Id is found, this is raised
    """

    try:
        return retry(lambda: models.Node.objects.get(id=id, enabled=enabled))
    except models.Node.DoesNotExist:
        return None
    except MultipleObjectsReturned:
        raise MultipleObjectsReturned()
