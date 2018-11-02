import { ajax } from 'rxjs/ajax';
import { combineEpics, ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators';
import { ADD_TRANSACTION, ADD_TIMING_DATA, FETCH_RANDOM_TRANSACTION } from "../actions/table";

export const fetchRandomTransaction = action$ => action$.pipe(
    ofType(FETCH_RANDOM_TRANSACTION),
    mergeMap(action =>
        ajax.get('http://127.0.0.1:8000/transactions/random').pipe(
            map(data => {
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
                }
            )
        )
    )
);

export const fetchTransactionTiming = action$ => action$.pipe(
    ofType(ADD_TRANSACTION),
    mergeMap(action =>

        fetch('http://127.0.0.1:8000/transactions/send', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                id: action.transactionData.id
            })
        }).then((response) => {
            console.log(response);
            return response.json();
        }).then((timingData) => {
            console.log(timingData);
            return { type: ADD_TIMING_DATA, timingData };
        })
    )
);

// export const fetchTransactionTiming = action$ => action$.pipe(
//     ofType(ADD_TRANSACTION),
//     mergeMap(action =>
//         ajax.post('http://127.0.0.1:8000/transactions/send', {id: action.transactionData.id}).pipe(
//             map(data => {
//                     debugger;
//                     const transactionData = data.response;
//                     // transactionData.amount = parseFloat(transactionData.amount);

//                     // ['origin', 'destination'].forEach((key) => {
//                     //     transactionData[key].coords = {
//                     //         lat: parseFloat(transactionData[key].latitude),
//                     //         lng: parseFloat(transactionData[key].longitude)
//                     //     };
//                     // });

//                     return { type: ADD_TIMING_DATA, transactionData };
//                 }
//             )
//         )
//     )
// );

export default combineEpics(
    fetchRandomTransaction,
    fetchTransactionTiming
);
