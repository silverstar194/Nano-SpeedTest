import {SET_TIMING_STATUS, SET_TRANSACTION_STATUS} from '../actions/transactions';
export const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_TRANSACTION_STATUS:
            return {
                ...state,
                isFetchingTransaction: action.status
            };
      	case SET_TIMING_STATUS:
			return {
				...state,
				isFetchingTiming: action.status
			};
    	default:
      		return state;
  	}
}