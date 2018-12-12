import {
    openAdvSettings,
    ADV_SETTINGS_OPENED
} from '../advancedModal';

describe('Actions - nodes', () => {
    it('should correctly setup openAdvSettings action', () => {

        const action = openAdvSettings({});

        expect(action).toEqual({
            type: ADV_SETTINGS_OPENED
        });
    });
});
