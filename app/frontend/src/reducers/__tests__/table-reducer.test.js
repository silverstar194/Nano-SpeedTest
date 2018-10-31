import addTransactionReducer, {INITIAL_STATE} from '../../reducers/table';
import {ADD_TRANSACTION} from '../../actions/table';

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
});