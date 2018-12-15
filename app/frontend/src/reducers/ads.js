import {UPDATE_CURRENT_AD} from 'actions/ads';
export const INITIAL_STATE = {
	currentAd: {
		title: 'Loading...',
		message: 'Loading...',
		url: ''
	}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
          case UPDATE_CURRENT_AD:
			return {
				...state,
				currentAd: action.ad
			};
    	default:
      		return state;
  	}
};