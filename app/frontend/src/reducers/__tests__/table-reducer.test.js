import addTransactionReducer, {INITIAL_STATE} from '../../reducers/table';
import {ADD_TRANSACTIONS, ADD_TIMING_DATA} from '../../actions/table';

describe('Reducer - table', () => {
    it('should return the initial state', () => {
        expect(addTransactionReducer(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should add a transaction', () => {
        const transactionData = [{
            hash: 'abc-123',
            origin: 'Chicago',
            destination: 'San Diego',
            time: 7.1,
            amount: 11111,
            completed: 'Oct 9, 2018'
        }];
        const action = {
            type: ADD_TRANSACTIONS,
            transactionData
        };
        const state = addTransactionReducer([], action);
        expect(state).toEqual([...transactionData]);
    });

    it('should add a timing', () => {
        const preComputedState = [
            {
                id: 123
            },
            {
                id: 222
            }
        ];
        const timingData = [{
            id: 123,
            test: 'foo-bar'
        }];
        const action = {
            type: ADD_TIMING_DATA,
            timingData
        };
        const state = addTransactionReducer(preComputedState, action);
        expect(state).toEqual([
            {
                id: 123,
                test:'foo-bar',
                completed: true
            },
            {
                id: 222
            }
        ]);
    });
});