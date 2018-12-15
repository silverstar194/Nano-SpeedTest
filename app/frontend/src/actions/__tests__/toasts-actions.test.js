import {
    ADD_TOAST,
    REMOVE_TOAST,
    addToast,
    removeToast
} from '../toasts';

describe('Actions - toasts', () => {
    it('should correctly setup addToasts action', () => {
        const toast = {
            foo: 'bar',
            autoDismiss: false
        };
        const action = addToast(toast);

        expect(action).toEqual({
            type: ADD_TOAST,
            toast: {
                ...toast,
                autoDismiss: false,
                id: 0
            }
        });
    });

    it('setup removeToast action', () => {
        const id = 2;
        const action = removeToast(id);

        expect(action).toEqual({
            type: REMOVE_TOAST,
            id: 2
        });
    });
});