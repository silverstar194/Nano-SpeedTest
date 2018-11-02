import {
    setTransactionFetchStatus,
    setTimingFetchStatus,
} from './actions/transactions';

import {
    FETCH_RANDOM_TRANSACTION,
    ADD_TRANSACTION,
    ADD_TIMING_DATA
} from './actions/table';

// 'Listens' for actions and will dispatch others while they are occurring
const transactionsMiddleware = store => next => action => {
    switch(action.type) {
        case FETCH_RANDOM_TRANSACTION:
            store.dispatch(setTransactionFetchStatus(true));
            break;
        case ADD_TRANSACTION:
            store.dispatch(setTransactionFetchStatus(false));
            store.dispatch(setTimingFetchStatus(true));
            break;
        case ADD_TIMING_DATA:
            store.dispatch(setTimingFetchStatus(false));
            break;
        default:
            break;
    }
    next(action);
};

export default transactionsMiddleware;