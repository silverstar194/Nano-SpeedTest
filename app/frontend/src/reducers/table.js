import { ADD_TIMING_DATA, ADD_TRANSACTIONS, FETCH_TRANSACTION } from '../actions/table';

export const INITIAL_STATE = {
    num: 1,
    rows: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_TRANSACTION:
            return {
                num: action.num,
                rows: [...state.rows]
            };

        case ADD_TRANSACTIONS:
            return {
                num: state.num,
                rows: [
                    ...state.rows,
                    ...action.transactionData
                ]
            };
        case ADD_TIMING_DATA:
            // state is an array
            // action.timingData is in array
            //combine the two
            const newState = {
                num: state.num,
                rows: [...state.rows]
            };
            newState.rows.forEach((trans) => {
                action.timingData.forEach((incomingData) => {
                    if (trans.id === incomingData.id) {
                        Object.assign(trans, {
                            ...incomingData,
                            completed: true
                        });
                    }
                });
            });
            return {
                num: state.num,
                rows: [...newState.rows]
            };
        default:
            return state;
    }
};