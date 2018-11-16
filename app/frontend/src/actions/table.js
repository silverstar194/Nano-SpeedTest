export const FETCH_TRANSACTION = 'FETCH_TRANSACTION';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const ADD_TIMING_DATA = 'ADD_TIMING_DATA';

export const fetchTransaction = transactionParams => {
    return {
        type: FETCH_TRANSACTION,
        transactionParams
    };
};

export const addTransaction = transactionData => {
    return {
        type: ADD_TRANSACTION,
        transactionData
    };
};

export const addTimingData = timingData => {
    return {
        type: ADD_TIMING_DATA,
        timingData
    };
};