import {SWITCH_TAB} from '../actions/navigation';
export const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      	case SWITCH_TAB:
			return {
				...state,
				activeTab: action.tab
			};
    	default:
      		return state;
  	}
}