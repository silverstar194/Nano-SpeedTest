import { combineEpics, ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { ADD_TRANSACTIONS, ADD_TIMING_DATA, FETCH_TRANSACTION } from 'actions/table';
import { convertCoordsToString, fetchWrapper } from 'util/helpers';

//TODO going to need better error handling if rejected or times out
export const fetchTransaction = action$ => action$.pipe(
    ofType(FETCH_TRANSACTION),
    mergeMap(action =>
        fetchWrapper('http://127.0.0.1:8000/transactions', {
            method: 'POST',
            body: JSON.stringify(action.transactionParams)
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
            //TODO handle error
            console.warn('TODO error in fetchTransaction');
        })
    )
);

//TODO going to need better error handling if rejected or times out
export const fetchTransactionTiming = action$ => action$.pipe(
    ofType(ADD_TRANSACTIONS),
    mergeMap(action =>
        fetchWrapper('http://127.0.0.1:8000/transactions/send', {
            method: 'POST',
            body: JSON.stringify({
                id: action.batchId
            })
        }).then((parsedResponse) => {
            return { type: ADD_TIMING_DATA, timingData: parsedResponse.transactions};
        }).catch((err) => {
            //TODO throw something
            console.warn('TODO error in fetchTransactionTiming');
            action.transactionData.forEach((trans) => {
                trans.error = true;
            });
            return { type: ADD_TIMING_DATA, timingData: action.transactionData};
        })
    )
);

export default combineEpics(
    fetchTransaction,
    fetchTransactionTiming
);
