import addTransactionReducer, {INITIAL_STATE} from '../../reducers/table';
import {ADD_TRANSACTIONS, ADD_TIMING_DATA, FETCH_TRANSACTION} from 'actions/table';

describe('Reducer - table', () => {
    it('should return the initial state', () => {
        expect(addTransactionReducer(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should add a transaction', () => {
        const num = 1;
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
            num,
            transactionData
        };

        const state = addTransactionReducer(INITIAL_STATE, action);

        expect(state).toEqual({
            num,
            rows: transactionData
        });
    });

    it('should add a timing', () => {
        const preComputedState = {
            rows: [{
                id: 123
            },
            {
                id: 222
            }],
            num: 2
        };
        const timingData = [{
            id: 123,
            test: 'foo-bar'
        }];
        const action = {
            type: ADD_TIMING_DATA,
            timingData
        };
        const state = addTransactionReducer(preComputedState, action);
        expect(state).toEqual({
            num: 2,
            rows: [{
                id: 123,
                test:'foo-bar',
                completed: true
            },
            {
                id: 222
            }]
        });
    });
    it('should add a timing', () => {
        const preComputedState = {
            rows: [{
                id: 123
            },
            {
                id: 222
            }],
            num: 2
        };
        const timingData = [{
            id: 123,
            test: 'foo-bar'
        }];
        const action = {
            type: ADD_TIMING_DATA,
            timingData
        };
        const state = addTransactionReducer(preComputedState, action);
        expect(state).toEqual({
            num: 2,
            rows: [{
                id: 123,
                test:'foo-bar',
                completed: true
            },
            {
                id: 222
            }]
        });
    });
});