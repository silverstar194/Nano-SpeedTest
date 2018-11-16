import { ADD_PAST_RESULTS } from 'actions/pastResults';

export const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_PAST_RESULTS:
            return [
                ...action.pastResults
            ];
        default:
            return state;
    }
};