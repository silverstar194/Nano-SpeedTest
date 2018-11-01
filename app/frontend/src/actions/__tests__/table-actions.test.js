import {addTransaction, ADD_TRANSACTION} from '../table';

describe('Actions - addTransaction', () => {
    it('should correctly setup addTransaction action', () => {
        const transactionData = {
            hash: 'abc-123',
            origin: 'Chicago',
            destination: 'San Diego',
            time: 7.1,
            amount: 11111,
            completed: 'Oct 9, 2018'
        };
        const action = addTransaction(transactionData);

        expect(action).toEqual({
            type: ADD_TRANSACTION,
            transactionData
        });
    });
});