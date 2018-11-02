# Nano-SpeedTest

## Table of Contents 
- [Front End](#nano-speedtest-frontend)
- [Front End: Getting Started](#getting-started)
- [Front End: Testing](#frontend-testing)
- [Front End: Other Information](#other-information)
- [Back_End](#nano-speedtest-backend)
- [Back End: Installing Dependencies](#installing-dependencies) 
- [Back_End: Testing](#backend-testing)
- [Back End: Setting Up Node](#setting-up-node)

This website is able to time nano transactions from between nodes in distinct places. In order to run the project on your own computer, there are two disctinct parts you must setup: frontend and backend.

# Nano Speedtest Frontend
This frontend is created using React. Below are instructions on how to get started and other useful resources.

## Getting Started
1. Clone this repo by running `git clone https://github.com/silverstar194/Nano-SpeedTest.git`
2. Install node in order to use `npm` commands - `brew install node` (install here for windows: https://nodejs.org/en/)
3. Navigate to `Nano-SpeedTest/app/frontend`
4. Install all node dependencies - `npm install`
5. Run app in development mode - `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

NOTE - Currently google maps require a specific API key. For development purposes in the frontend folder create a file called `.env` and place inside `REACT_APP_GOOGLE_MAPS_KEY=AIzaSyD27p9eUBuinHJFiVnnT6EA8tLm1bDAgow`. Using `process.env.<VARIABLE>` requires placing the variable you wish to use in the `.env` file prefixed with `REACT_APP_<YOUR_NAME>` which can then be used in the code as `process.env.REACT_APP_<YOUR_NAME>`. If you want to use the variable in the index.html file it must be wrapped `"%<VARIABLE_NAME>%"`.

## Frontend Testing
Currently basic unit testing of redux actions and reducers exists. Running `npm test` triggers tests to run and continue to run on file changes.

In addition, `npm test -- --coverage` (yes there are two --) will show the coverage report. Currently only `.js` files are being tested and it is specifically set to ignore additional files such as `index.js` and `serviceWorker.js`. These options can be changed in the `package.json`.

## Other Information
For the project to build, **these files must exist with exact filenames**:

- `public/index.html` is the page template;
- `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by Webpack.<br>
You need to **put any JS and CSS files inside `src`**, otherwise Webpack won’t see them.

Only files inside `public` can be used from `public/index.html`.<br>
Read instructions below for using assets from JavaScript and HTML.

You can, however, create more top-level directories.<br>
They will not be included in the production build so you can use them for things like documentation.

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
$ pip3 install djangorestframework
$ pip3 install markdown
$ pip3 install django-filter
```

### Other Python Dependencies

```sh
$ pip3 install requests  # Used for sending HTTP Requests
$ pip3 install nano-python  # RPC wrapper for Nano
$ pip3 install mysqlclient  # We are using a MySQL database
$ pip3 install django-ipware  # Used for getting IP from REST request
```

## Environment Variable Setup

### dPoW API

In order to run the Django server, the following environment variables need to exist (the server will not start without them). They are not provided here for security.

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

### Calling management commands

These commands and code can be found in `./speedtest_api/management/commands/`

The following runs the account balancer (attach this to a cron job):
```sh
$ python manage.py balance_accounts
```

The following generates wallets and accounts on available nodes and adds them to the database:
```sh
$ python manage.py populate_nodes
```

The following calculates the Proof of Work for all accounts (unless they have a valid POW):
```sh
$ python manage.py regen_pow
```

The following synchronizes the balance of all accounts from the Nano network to our database balance:
```sh
$ python manage.py sync_accounts
```

## Backend Testing
Currently backend tests can be run as follows:
```sh
$ python manage.py test
```
In order to do this you need to have a node set up. We have included a link on setup in the next section.

## Setting Up Node
https://github.com/nanocurrency/raiblocks/wiki/Docker-node

