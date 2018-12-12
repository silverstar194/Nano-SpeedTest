import toastsReducer, {INITIAL_STATE} from 'reducers/toasts';
import {ADD_TOAST, REMOVE_TOAST} from 'actions/toasts';

describe('Reducer - toasts', () => {
    it('should return the initial state', () => {
        expect(toastsReducer(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('should add a toast', () => {
        const toast = {
            autoDismiss: false,
            message: 'hello'
        };
        const action = {
            type: ADD_TOAST,
            toast
        };

        const state = toastsReducer(INITIAL_STATE, action);

        expect(state).toEqual([
            {...toast}
        ]);
    });

    it('should remove a toast', () => {
        const preComputedState = [
            {
                id: 2
            },
            {
                id: 1
            }
        ];

        const action = {
            type: REMOVE_TOAST,
            id: 1
        };
        const state = toastsReducer(preComputedState, action);
        expect(state).toEqual([
            { id: 2}
        ]);
    });
});