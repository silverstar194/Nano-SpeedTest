import reducer, {INITIAL_STATE} from '../../reducers/transactions';
import {SET_TRANSACTION_STATUS, SET_TIMING_STATUS} from '../../actions/transactions';

describe('Reducer - transactions', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should change transaction status', () => {
        const action = {
            type: SET_TRANSACTION_STATUS,
            status: true
        };
        const state = reducer({}, action);
        expect(state).toEqual({isFetchingTransaction: true});
    });

    it('should change timing status', () => {
        const action = {
            type: SET_TIMING_STATUS,
            status: true
        };
        const state = reducer({}, action);
        expect(state).toEqual({isFetchingTiming: true});
    });
});