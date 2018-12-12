import {
    updateAd,
    UPDATE_CURRENT_AD
} from '../ads';

describe('Actions - ads', () => {
    it('should correctly setup updateAd action', () => {
        const ad = {
            title: 'Title',
            destination: 'Message',
            url: 'www.test.com'
        };

        const action = updateAd(ad);

        expect(action).toEqual({
            type: UPDATE_CURRENT_AD,
            ad
        });
    });
});
