import { combineEpics, ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { ADD_TRANSACTION, ADD_TIMING_DATA, FETCH_TRANSACTION } from 'actions/table';
import { convertCoordsToString } from 'util/helpers';

//TODO going to need better error handling if rejected or times out
export const fetchTransaction = action$ => action$.pipe(
    ofType(FETCH_TRANSACTION),
    mergeMap(action =>
        fetch('http://127.0.0.1:8000/transactions', {
            method: 'POST',
            body: JSON.stringify(action.transactionParams)
        }).then((response) => {
            if (response.ok) return response.json();
            debugger;
            return {
                error: true
            };
        }).then((data) => {
            console.log(data);
            const transactionData = data.transactions[0];
            transactionData.id = data.id;
            transactionData.amount = parseFloat(transactionData.amount);
            transactionData.completed = false;

            ['origin', 'destination'].forEach((key) => {
                transactionData[key].coords = convertCoordsToString(transactionData[key]);
            });

            return { type: ADD_TRANSACTION, transactionData };
        })
    )
);

//TODO going to need better error handling if rejected or times out
export const fetchTransactionTiming = action$ => action$.pipe(
    ofType(ADD_TRANSACTION),
    mergeMap(action =>
        // fetch('http://127.0.0.1:8000/transactions/send', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         id: action.transactionData.id
        //     })
    // )}
        Promise.resolve()
        .then(response => {
            // if (response.ok) return response.json();
            // return { TODO
            //     error: true,
            //     id: action.transactionData.id
            // };
            const endReceiveTimestamp = Date.now();
            const startSendTimestamp = Date.now() - parseInt(Math.random() * 50000);
            const elapsedTime = endReceiveTimestamp - startSendTimestamp;
            return {
                // error: true, TODO - disables error handling
                id: action.transactionData.id,
                startSendTimestamp,
                endReceiveTimestamp,
                elapsedTime
            };
        }).then((timingData) => ({ type: ADD_TIMING_DATA, timingData }) )
        .catch((err) => {
            debugger;
        })
    )
);

export default combineEpics(
    fetchTransaction,
    fetchTransactionTiming
);
