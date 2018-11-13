export const FETCH_RANDOM_TRANSACTION = 'FETCH_RANDOM_TRANSACTION';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const ADD_TIMING_DATA = 'ADD_TIMING_DATA';

export const fetchRandomTransaction = () => {
    return {
        type: FETCH_RANDOM_TRANSACTION
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