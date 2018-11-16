export const ADD_PAST_RESULTS = 'ADD_PAST_RESULTS';

export const addPastResults = (pastResults) => {
    return {
        type: ADD_PAST_RESULTS,
        pastResults
    };
};
