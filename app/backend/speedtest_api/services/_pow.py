import requests
from django.conf import settings as settings


POW_ENDPOINT = "http://178.62.11.37:5000/work"


# Returns a json object with a 'work' property containing the POW
def get_pow(hash):
    data = {
            'hash': hash,
            'key': settings.DPOW_API_KEY
        }

    res = requests.post(url=POW_ENDPOINT, json=data)

    res.raise_for_status()

    return res.json()
