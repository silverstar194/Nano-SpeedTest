import { ADD_TIMING_DATA, ADD_TRANSACTIONS, FETCH_TRANSACTION } from '../actions/table';

export const INITIAL_STATE = {
    num: 1,
    mostRecentLocations: [],
    tableEntries: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_TRANSACTION:
            return {
                ...state,
                num: action.num,
            };

        case ADD_TRANSACTIONS:
            const transactions = [];
            for (let i = 0; i < state.num; i++) {
                transactions.push({
                    origin: action.transactionData[i].origin.id,
                    destination: action.transactionData[i].destination.id
                });
            }

            return {
                num: state.num,
                mostRecentLocations: [...state.mostRecentLocations, ...transactions],
                tableEntries: [...state.tableEntries, ...action.transactionData]
            };
        case ADD_TIMING_DATA:
            // state.tableEntries is an array
            // action.timingData is in array
            // combine the two
            const newState = { ...state };
            newState.tableEntries.forEach((trans) => {
                action.timingData.forEach((incomingData) => {
                    if (trans.id === incomingData.id) {
                        Object.assign(trans, {
                            ...incomingData,
                            completed: true
                        });
                    }
                });
            });
            return { ...newState };

        default:
            return state;
    }
};