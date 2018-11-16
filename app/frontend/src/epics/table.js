import { combineEpics, ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { ADD_TRANSACTIONS, ADD_TIMING_DATA, FETCH_TRANSACTION } from 'actions/table';
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
            // data has transactions and a batchId
            //batchId is used to fetch the data on it
            const transactionData = data.transactions.map((trans) => {
                trans.completed = false;
                ['origin', 'destination'].forEach((key) => {
                    trans[key].coords = convertCoordsToString(trans[key]);
                });
                return trans;
            });
            return { type: ADD_TRANSACTIONS, transactionData, batchId: data.id };
        }).catch((err) => {
            debugger;
            console.error(err);
        })
    )
);

//TODO going to need better error handling if rejected or times out
export const fetchTransactionTiming = action$ => action$.pipe(
    ofType(ADD_TRANSACTIONS),
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
        }).then((parsedResponse) => {
            return { type: ADD_TIMING_DATA, timingData: parsedResponse.transactions};
        }).catch((err) => {
            debugger;
        })
    )
);

export default combineEpics(
    fetchTransaction,
    fetchTransactionTiming
);
