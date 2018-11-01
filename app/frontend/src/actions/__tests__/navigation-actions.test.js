import {switchTab, SWITCH_TAB} from '../navigation';

describe('Actions - switchTab', () => {
    it('has correct Action Type', () => {
        expect(switchTab('test')).toEqual(
            expect.objectContaining({
                type: SWITCH_TAB
            })
        );
    });

    it('passes the target tab correctly', () => {
        const tab = 'newTab';
        expect(switchTab(tab)).toEqual(
            expect.objectContaining({
                tab
            })
        );
    });
});