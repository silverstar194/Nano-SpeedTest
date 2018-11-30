export const ADD_TOAST = 'ADD_TOAST';
export const REMOVE_TOAST = 'REMOVE_TOAST';

let toastId = 0;

export const addToast = (toast) => {
    return {
        type: ADD_TOAST,
        toast: {
            autoDismiss: true,
            ...toast,
            id: toastId++
        }
    };
};

export const removeToast = (id) => {
    return {
        type: REMOVE_TOAST,
        id
    };
};