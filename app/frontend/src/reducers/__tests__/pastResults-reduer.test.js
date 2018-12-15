import pastResultsReducer, {INITIAL_STATE} from 'reducers/pastResults';
import {ADD_ALL_PAST_RESULTS, APPEND_PAST_RESULTS} from 'actions/pastResults';

describe('Reducer - pastResults', () => {
    it('should return the initial state', () => {
        expect(pastResultsReducer(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should add all data', () => {
        const input = {
            pastTransactions: [{
                origin: 'SF',
                destination: 'LA'
            }],
            totalTransactions: 125,
            globalAverage: 25.333
        };
        const action = {
            type: ADD_ALL_PAST_RESULTS,
            ...input
        };
        const state = pastResultsReducer(INITIAL_STATE, action);
        expect(state).toEqual({...input});
    });

    it('should be no change in state', () => {
        const savedState = {
            pastTransactions: [{
                origin: 'SF',
                destination: 'LA'
            }],
            totalTransactions: 125,
            globalAverage: 25.333
        };
        const action = {
            type: ADD_ALL_PAST_RESULTS,
            ...savedState
        };
        const state = pastResultsReducer(savedState, action);
        expect(state).toEqual({...savedState});
    });

    it('should add new data', () => {
        const input = [{
            origin: 'SF',
            destination: 'LA'
        }];
        const action = {
            type: APPEND_PAST_RESULTS,
            newResults: input
        };
        const state = pastResultsReducer(INITIAL_STATE, action);
        expect(state).toEqual({pastTransactions: input});
    });

});