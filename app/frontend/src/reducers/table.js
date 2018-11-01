import {ADD_TRANSACTION} from '../actions/table';
export const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_TRANSACTION:
            return [
                ...state,
                action.transactionData
            ];
        default:
            return state;
    }
}