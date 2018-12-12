import {
    addTransactions,
    ADD_TRANSACTIONS,

    addTimingData,
    ADD_TIMING_DATA,

    FETCH_TRANSACTION,
    fetchTransaction
} from '../table';

describe('Actions - table', () => {
    it('should correctly setup addTransactions action', () => {
        const batchId = 1;
        const transactionData = {
            hash: 'abc-123',
            origin: 'Chicago',
            destination: 'San Diego',
            time: 7.1,
            amount: 11111,
            completed: 'Oct 9, 2018'
        };
        const action = addTransactions(transactionData, batchId);

        expect(action).toEqual({
            type: ADD_TRANSACTIONS,
            transactionData,
            batchId
        });
    });

    it('should correctly setup addTimingData action', () => {
        const timingData = {
           id: 123
        };
        const action = addTimingData(timingData);

        expect(action).toEqual({
            type: ADD_TIMING_DATA,
            timingData
        });
    });

    it('should correctly setup fetchTransaction action', () => {
        const num = 1;
        const data = {
           id: 123
        };
        const action = fetchTransaction(num, data);

        expect(action).toEqual({
            type: FETCH_TRANSACTION,
            num,
            transactionParams: data
        });
    });
});
