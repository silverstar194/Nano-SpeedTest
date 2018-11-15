import { ajax } from 'rxjs/ajax';
import { combineEpics, ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import { ADD_TRANSACTION, ADD_TIMING_DATA, FETCH_RANDOM_TRANSACTION } from "../actions/table";

//TODO going to need better error handling if rejected or times out
export const fetchRandomTransaction = action$ => action$.pipe(
    ofType(FETCH_RANDOM_TRANSACTION),
    mergeMap(action =>
        fetch('http://127.0.0.1:8000/transactions/send', {
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
            debugger;
            const transactionData = data.response;
            transactionData.amount = parseFloat(transactionData.amount);
            transactionData.completed = false;

            ['origin', 'destination'].forEach((key) => {
                transactionData[key].coords = {
                    lat: parseFloat(transactionData[key].latitude),
                    lng: parseFloat(transactionData[key].longitude)
                };
            });

            return { type: ADD_TRANSACTION, transactionData };
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
                id: action.transactionData.id
            })
        }).then(response => {
            if (response.ok) return response.json();
            return {
                error: true,
                id: action.transactionData.id
            };
        }).then((timingData) => ({ type: ADD_TIMING_DATA, timingData }) )
    )
);

export default combineEpics(
    fetchRandomTransaction,
    fetchTransactionTiming
);
