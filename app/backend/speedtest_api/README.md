# SpeedTest Backend API

## Routes

### POST /transactions/random
Sends a random amount of Nano between two random nodes 

Parameters: None

Returns: A JSON object with the general information on the transaction 
in the form of:

{
    "transaction": {
        "id": 122,
        "origin": {
            "id": 1,
            "latitude": 19.154428,
            "longitude": 72.849616
        },
        "destination": {
            "id": 2,
            "latitude": 37.794591,
            "longitude": -122.40412
        },
        "amount": 1
    }
}

Throws: None

### GET /transactions/?id={transactionID}
Gets the timing information of the transaction specified in the id field

Parameters: id

Returns: A successful query results in a JSON object with the start and end times of the transaction 
in the form of:

{
    "id": 122,
    "start_timestamp": 1541037025340,
    "end_timestamp": 1541037035340
}

An unseccessful query results in a 404 Not Found and:

{
    "message": "Transaction not found."
}

Throws: 404 Not Found