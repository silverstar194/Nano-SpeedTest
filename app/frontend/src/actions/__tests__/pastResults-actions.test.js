import {
    ADD_PAST_RESULTS,
    addPastResults
} from '../pastResults';

describe('Actions - pastResults', () => {
    it('should correctly setup addPastResults action', () => {
        const data = {
            pastTransactions: [{}],
            totalTransactions: 125,
            globalAverage: 25.333
        };
        const action = addPastResults(data);

        expect(action).toEqual({
            type: ADD_PAST_RESULTS,
           ...data
        });
    });
});