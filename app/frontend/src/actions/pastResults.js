export const ADD_PAST_RESULTS = 'ADD_PAST_RESULTS';

export const addPastResults = ({pastTransactions, totalTransactions, globalAverage}) => {
    return {
        type: ADD_PAST_RESULTS,
        pastTransactions,
        totalTransactions,
        globalAverage
    };
};
