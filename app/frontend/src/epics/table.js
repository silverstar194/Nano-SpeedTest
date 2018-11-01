import { ajax } from 'rxjs/ajax';
import { combineEpics, ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import { ADD_TRANSACTION, FETCH_RANDOM_TRANSACTION } from "../actions/table";

export const fetchRandomTransaction = action$ => action$.pipe(
    ofType(FETCH_RANDOM_TRANSACTION),
    mergeMap(action =>
        ajax.post('http://127.0.0.1:8000/transactions/random').pipe(
            map(data => {
                    const transactionData = data.response.transaction;

                    // TODO - use "reverse geocoding" via the google maps api to get the city names and put them in
                    // for origin and dest
                    const tableData = {
                        hash: transactionData.id.toString(),
                        origin: transactionData.origin.latitude + ',' + transactionData.origin.longitude,
                        destination: transactionData.destination.latitude + ',' + transactionData.destination.longitude,
                        time: 3.23,
                        amount: transactionData.amount,
                        completed: 'Now'
                    };
                    return { type: ADD_TRANSACTION, transactionData: tableData };
                }
            )
        )
    )
);

export default combineEpics(
    fetchRandomTransaction
);
