import {addToast, removeToast} from 'actions/toasts';

let dispatch = null;

export const initToastStore = (store) => {
    dispatch = store.dispatch;
};

export const makeToast = (options) => {
   const toastAction = addToast(options);
   dispatch(toastAction);
   if (toastAction.toast.autoDismiss) {
       const {toast} = toastAction;
        setTimeout(() => {
            dispatch(removeToast(toast.id));
        }, toast.dismissTime || 3000);
   }

};