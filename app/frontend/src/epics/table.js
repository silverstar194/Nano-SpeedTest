import { combineEpics, ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { ADD_TRANSACTIONS, ADD_TIMING_DATA, FETCH_TRANSACTION } from 'actions/table';
import { convertCoordsToString, fetchWrapper } from 'util/helpers';
import { makeToast } from 'util/toasts';
import { setTransactionFetchStatus } from 'actions/transactions';

//TODO going to need better error handling if rejected or times out
export const fetchTransaction = action$ => action$.pipe(
    ofType(FETCH_TRANSACTION),
    mergeMap(action =>
        fetchWrapper('transactions', {
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
           if(err.status == 403){
		console.warn('Error in Fetching Timing Data Due to API Abuse');
                makeToast({
                        text: 'Please stop spamming tests or you will be banned for 24 hours.',
                        status: 'danger'
                });
	   }else{
		
	   	console.warn('Error: Failed to Create Transaction');
          	console.log(err); 
	   	makeToast({
                	text: 'Something went wrong while creating the transaction',
                	status: 'danger'
            	});
	   }
            return setTransactionFetchStatus(false);
        })
    )
);

//TODO going to need better error handling if rejected or times out
export const fetchTransactionTiming = action$ => action$.pipe(
    ofType(ADD_TRANSACTIONS),
    mergeMap(action =>
        fetchWrapper('transactions/send', {
            method: 'POST',
            body: JSON.stringify({
                id: action.batchId
            })
        }).then((parsedResponse) => {
            makeToast({
                text: 'Transaction Complete',
                status: 'success'
            });
            return { type: ADD_TIMING_DATA, timingData: parsedResponse.transactions};
        }).catch((err) => {
	    if(err.status == 403){
		console.warn('Error in Fetching Timing Data Due to API Abuse');
            	makeToast({
         		text: 'Please stop spamming tests or you will be banned for 24 hours.',
                	status: 'danger'
           	});
	   
	    }else{
		console.warn('Error in Fetching Timing Data');
		makeToast({
                	text: 'Something went wrong while fetching the transaction from our server',
               		status: 'danger'
            	});
	    }
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
