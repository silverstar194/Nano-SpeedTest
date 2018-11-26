import {
    ADD_ALL_PAST_RESULTS,
    addPastResults,
    appendPastResults,
    APPEND_PAST_RESULTS
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
            type: ADD_ALL_PAST_RESULTS,
           ...data
        });
    });

    it('should correctly setup appendPastResults action', () => {
        const newResults = [{
            foo: 'bar'
        }];
        const action = appendPastResults(newResults);

        expect(action).toEqual({
            type: APPEND_PAST_RESULTS,
           newResults
        });
    });
});