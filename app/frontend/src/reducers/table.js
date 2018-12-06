import {ADD_TRANSACTIONS, ADD_TIMING_DATA} from '../actions/table';
export const INITIAL_STATE = {
    mostRecentLocations: {
        origin: null,
        destination: null
    },
    tableEntries: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_TRANSACTIONS:
            return {
                mostRecentLocations: {
                    origin: action.transactionData[0].origin.id,
                    destination: action.transactionData[0].destination.id
                },
                tableEntries: [...state.tableEntries, ...action.transactionData]
            };
        case ADD_TIMING_DATA:
            // state.tableEntries is an array
            // action.timingData is in array
            // combine the two
            const newState = {...state};
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
            return {...newState};

        default:
            return state;
    }
};