export const FETCH_TRANSACTION = 'FETCH_TRANSACTION';
export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS';
export const ADD_TIMING_DATA = 'ADD_TIMING_DATA';

export const fetchTransaction = transactionParams => {
    return {
        type: FETCH_TRANSACTION,
        transactionParams
    };
};

export const addTransactions = (transactionData, batchId) => {
    return {
        type: ADD_TRANSACTIONS,
        transactionData,
        batchId
    };
};

export const addTimingData = timingData => {
    return {
        type: ADD_TIMING_DATA,
        timingData
    };
};