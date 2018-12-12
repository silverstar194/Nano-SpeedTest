import adsReducer, {INITIAL_STATE} from 'reducers/ads';
import {UPDATE_CURRENT_AD} from 'actions/ads';

describe('Reducer - ads', () => {
    it('should return the initial state', () => {
        expect(adsReducer(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should update the add', () => {
        const ad = {
            title: 'Title',
            destination: 'Message',
            url: 'www.test.com'
        };

        const action = {
            type: UPDATE_CURRENT_AD,
            ad
        };
        const state = adsReducer({}, action);
        expect(state).toEqual({
            currentAd: ad
        });
    });

});
