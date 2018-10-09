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
```

### Other Python Dependencies

```sh
$ pip install requests  # Used for sending HTTP Requests
```

## Environment Variable Setup

### dPoW API Key

In order to run the Django server, the `DPOW_API_KEY` environment variable needs to exist (the server will not start without it).

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
