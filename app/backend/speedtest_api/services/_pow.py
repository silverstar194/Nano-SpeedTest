import requests
from django.conf import settings as settings


"""
Generate a PoW using the distributed endpoint.

@param hash: Hash to generate PoW for
@return: Json object containing a work property
@raise httpError: Can't connect to dPoW, or dPoW timed out
"""
def get_pow(hash):
    data = {
            'hash': hash,
            'key': settings.DPOW_API_KEY
        }

    res = requests.post(url=settings.DPOW_ENDPOINT, json=data)

    res.raise_for_status()

    return res.json()
