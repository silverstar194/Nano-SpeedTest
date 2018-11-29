import {fetchWrapper} from 'util/helpers';
import {updateAd} from 'actions/ads';

export default function(store) {
    return fetchWrapper('header/random')
        .then((data) => {
            store.dispatch(updateAd(data.ad));
        }).catch((err) => {
            console.warn('Failed to fetch Ad' + err);
        });
}