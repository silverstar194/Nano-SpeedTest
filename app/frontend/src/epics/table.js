import { ajax } from 'rxjs/ajax';
import { combineEpics, ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import { ADD_TRANSACTION, ADD_TIMING_DATA, FETCH_RANDOM_TRANSACTION } from 'actions/table';
import { convertCoordsToString } from 'util/helpers';

//TODO going to need better error handling if rejected or times out
export const fetchRandomTransaction = action$ => action$.pipe(
    ofType(FETCH_RANDOM_TRANSACTION),
    mergeMap(action =>
        fetch('http://127.0.0.1:8000/transactions', {
            method: 'POST',
            body: JSON.stringify({
                transactions: [{
                    originNodeId: null,
                    destinationNodeId: null
                }]
            })
        }).then((response) => {
            if (response.ok) return response.json();
            debugger;
            return {
                error: true
            };
        }).then((data) => {
            // data has transactions and a batchId
            //batchId is used to fetch the data on it
            const transactionData = data.transactions[0];
            transactionData.amount = parseFloat(transactionData.amount);
            transactionData.completed = false;

            ['origin', 'destination'].forEach((key) => {
                transactionData[key].coords = convertCoordsToString(transactionData[key]);
            });
            return { type: ADD_TRANSACTION, transactionData, batchId: data.id };
        })
    )
);

//TODO going to need better error handling if rejected or times out
export const fetchTransactionTiming = action$ => action$.pipe(
    ofType(ADD_TRANSACTION),
    mergeMap(action =>
        fetch('http://127.0.0.1:8000/transactions/send', {
            method: 'POST',
            body: JSON.stringify({
                id: action.batchId
            })
        })
        .then(response => {
            if (response.ok) return response.json();
            debugger;
        }).then((timingData) => {
            debugger;
            return { type: ADD_TIMING_DATA, timingData};
        }).catch((err) => {
            debugger;
        })
    )
);

export default combineEpics(
    fetchRandomTransaction,
    fetchTransactionTiming
);
