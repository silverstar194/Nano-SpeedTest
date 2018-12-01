import {ADD_TOAST, REMOVE_TOAST} from 'actions/toasts';
export const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_TOAST:
            return [
                ...state,
                action.toast
            ];
        case REMOVE_TOAST:
            return [...state.filter(toast => toast.id !== action.id)];
        default:
            return state;
    }
};