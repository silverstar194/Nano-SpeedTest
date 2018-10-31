import reducer, {INITIAL_STATE} from '../../reducers/navigation';
import {switchTab} from '../../actions/navigation';

describe('Reducer - navigation', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should update the activeTab when running switchTab', () => {
        const switchTabAction = switchTab('newTab');
        expect(reducer({}, switchTabAction)).toEqual(
            expect.objectContaining({
                activeTab: 'newTab'
            })
        );
    });
});