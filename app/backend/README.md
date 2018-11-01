# Nano SpeedTest Backend

## Installing Dependencies

### Python 3

Make sure you have installed the latest version of Python 3 and pip from the [official Python website.](https://www.python.org/)

Verify the installation with the follwing command:

```sh
$ python --version
```

### Django

These are the Django packages installed by following [this tutorial.](https://www.django-rest-framework.org/#tutorial)

```sh
$ pip install djangorestframework
$ pip install markdown
$ pip install django-filter
$ pip install docutils
```

### Other Python Dependencies

```sh
$ pip install requests  # Used for sending HTTP Requests
$ pip install nano-python  # RPC wrapper for Nano
$ pip install mysqlclient  # We are using a MySQL database
```

## Environment Variable Setup

### dPoW API

In order to run the Django server, the following environment variables need to exist (the server will not start without them).

* `NANO_ST__DPOW__ENDPOINT` endpoint of the dPoW service
* `NANO_ST__DPOW__API_KEY` API key for the dPoW service
* `NANO_ST__DB__NAME`
* `NANO_ST__DB__USER`
* `NANO_ST__DB__PASSWORD`
* `NANO_ST__DB__HOST`

## Running the Server

Execute the following to host the web API locally.

```sh
$ python manage.py runserver <IP:Port (Optional)>
```

### Executing a Django Project Python Shell

One can execute a Django Python shell (similar to a standard Python shell but imports project) using the following command:

```sh
$ python manage.py shell
```

This provides a nice sandbox to interact with the API while coding.

## AWS CodeBuild and CodeDeploy

-- TODO --

## File Structure and Naming

-- TODO --
