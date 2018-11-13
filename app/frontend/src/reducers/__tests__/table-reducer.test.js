import addTransactionReducer, {INITIAL_STATE} from '../../reducers/table';
import {ADD_TRANSACTION, ADD_TIMING_DATA} from '../../actions/table';

describe('Reducer - table', () => {
    it('should return the initial state', () => {
        expect(addTransactionReducer(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should add a transaction', () => {
        const transactionData = {
            hash: 'abc-123',
            origin: 'Chicago',
            destination: 'San Diego',
            time: 7.1,
            amount: 11111,
            completed: 'Oct 9, 2018'
        };
        const action = {
            type: ADD_TRANSACTION,
            transactionData
        };
        const state = addTransactionReducer([], action);
        expect(state).toEqual([transactionData]);
    });

    it('should add a timing', () => {
        const timingData = {
            id: 123,
            test: 'foo-bar'
        };
        const action = {
            type: ADD_TIMING_DATA,
            timingData
        };
        const state = addTransactionReducer([{id: 123}], action);
        expect(state).toEqual([{
            ...timingData,
            completed: true
        }]);
    });
});