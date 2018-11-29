import { SWITCH_TAB } from 'actions/navigation';
import fetchAndUpdateAd from 'util/fetchAndUpdateAd';

// 'Listens' for tab switch and will fetch a new add
const adLoader = store => next => action => {
    switch(action.type) {
        case SWITCH_TAB:
            fetchAndUpdateAd(store);
            break;
        default:
            break;
    }
    next(action);
};

export default adLoader;