import {ADD_TRANSACTION, ADD_TIMING_DATA} from '../actions/table';
export const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_TRANSACTION:
            return [
                ...state,
                action.transactionData
            ];
        case ADD_TIMING_DATA:
            return state.map((trans) => {
                if (trans.id !== action.timingData.id) return trans;
                return {
                    ...trans,
                    ...action.timingData,
                    completed: true
                };
            });
        default:
            return state;
    }
};