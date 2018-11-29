import {fetchWrapper} from 'util/helpers';
import {updateAd} from 'actions/ads';

export default function(store) {
    return fetchWrapper('http://127.0.0.1:8000/advertisements/random')
        .then((data) => {
            store.dispatch(updateAd(data.ad));
        });
}