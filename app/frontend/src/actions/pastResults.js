export const ADD_ALL_PAST_RESULTS = 'ADD_ALL_PAST_RESULTS';
export const APPEND_PAST_RESULTS = 'APPEND_PAST_RESULTS';

export const addPastResults = ({pastTransactions = [], totalTransactions, globalAverage, overallGlobalAverage}) => {
    return {
        type: ADD_ALL_PAST_RESULTS,
        pastTransactions,
        totalTransactions,
        globalAverage,
        overallGlobalAverage,
    };
};

export const appendPastResults = (newResults) => {
    return {
        type: APPEND_PAST_RESULTS,
        newResults
    };
};
