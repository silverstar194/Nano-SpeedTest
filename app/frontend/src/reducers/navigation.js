import {SWITCH_TAB} from '../actions/navigation';

export default function navigation(state = {}, action) {
    switch (action.type) {
      	case SWITCH_TAB:
			return {
				...state,
				activeTab: action.tab
			}
    	default:
      		return state;
  	}
}