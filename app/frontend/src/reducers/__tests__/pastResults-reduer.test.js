import addPastResults, {INITIAL_STATE} from 'reducers/pastResults';
import {ADD_PAST_RESULTS} from 'actions/pastResults';

describe('Reducer - pastResults', () => {
    it('should return the initial state', () => {
        expect(addPastResults(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should add nodes', () => {
        const input = {
            pastTransactions: [{
                origin: 'SF',
                destination: 'LA'
            }],
            totalTransactions: 125,
            globalAverage: 25.333
        };
        const action = {
            type: ADD_PAST_RESULTS,
            ...input
        };
        const state = addPastResults(INITIAL_STATE, action);
        expect(state).toEqual({...input});
    });

});