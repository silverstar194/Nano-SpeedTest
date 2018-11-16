import { ADD_PAST_RESULTS } from 'actions/pastResults';

export const INITIAL_STATE = {
    pastTransactions: [],
    totalTransactions: 'Fetching...',
    globalAverage: 'Fetching...'
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_PAST_RESULTS:
            return {
                pastTransactions: action.pastTransactions,
                totalTransactions: action.totalTransactions,
                globalAverage: action.globalAverage
            };
        default:
            return state;
    }
};