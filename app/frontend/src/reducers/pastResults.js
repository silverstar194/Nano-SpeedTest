import { ADD_ALL_PAST_RESULTS, APPEND_PAST_RESULTS } from 'actions/pastResults';

export const INITIAL_STATE = {
    pastTransactions: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_ALL_PAST_RESULTS:
            const newState = {};
            newState.totalTransactions = action.totalTransactions;
            newState.globalAverage = action.globalAverage;

            // use the old state value if nothing has updated to prevent re-render
            newState.pastTransactions = (action.pastTransactions.length === state.pastTransactions.length)
                ? state.pastTransactions : action.pastTransactions;

            return {...newState};
        case APPEND_PAST_RESULTS:
            const pastTransactions = state.pastTransactions;
            action.newResults.forEach((res) => {
                pastTransactions.push(res);
            });
            return {
                ...state,
                pastTransactions
            };
        default:
            return state;
    }
};