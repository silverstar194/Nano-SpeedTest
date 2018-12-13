import {ADD_TOAST} from 'actions/toasts';
import { initToastStore, makeToast } from '../toasts';

it('should make a toast', () => {
    const store = {
        dispatch: jest.fn()
    };

    initToastStore(store);
    makeToast({ autoDismiss: false });
    expect(store.dispatch).toHaveBeenCalledWith({
        type: ADD_TOAST,
        toast: {
            autoDismiss: false,
            id: 0
        }
    });
});
