import {
    SET_TRANSACTION_STATUS,
    SET_TIMING_STATUS,
    setTimingFetchStatus,
    setTransactionFetchStatus
} from '../transactions';

describe('Actions - addTransaction', () => {
    it('should correctly setup setTransactionFetchStatus action', () => {
        const action = setTransactionFetchStatus(true);

        expect(action).toEqual({
            type: SET_TRANSACTION_STATUS,
            status: true
        });
    });

    it('should correctly setup setTimingFetchStatus action', () => {
        const action = setTimingFetchStatus(true);

        expect(action).toEqual({
            type: SET_TIMING_STATUS,
            status: true
        });
    });
});