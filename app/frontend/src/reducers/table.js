import {ADD_TRANSACTIONS, ADD_TIMING_DATA} from '../actions/table';
export const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_TRANSACTIONS:
            return [
                ...state,
                action.transactionData
            ];
        case ADD_TIMING_DATA:
            // state is an array
            // action.timingData is in array
            //combine the two
            const newState = [];
            state.forEach((trans) => {
                action.timingData.forEach((incomingData) => {
                    if (trans.id !== incomingData.id) {
                        newState.push(trans);
                    }
                    newState.push(
                        Object.assign(trans, {
                            ...incomingData,
                            completed: true
                        })
                    );
                });
            });
            return [...newState];
        default:
            return state;
    }
};