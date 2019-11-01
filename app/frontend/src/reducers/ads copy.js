import {UPDATE_ORGIN_AND_DESTINATION} from 'actions/settings';

export const INITIAL_STATE = {
    initialValues: {
        origin: undefined,
        destination: undefined,
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
          case UPDATE_ORGIN_AND_DESTINATION:
			return {
				...state,
				origin: action.origin
				origin: action.destination
			};
    	default:
      		return state;
  	}
};