import { SET_HAS_FOCUS, SET_CURRENT_LOCATION } from '../actions/browser';
import { RESET } from '../actions/common';

const INITIAL_STATE = {
    hasFocus: false,
    currentLocation: document.location
};

export default function BrowserReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);
        case SET_HAS_FOCUS:
            return {
                ...state,
                hasFocus: action.hasFocus
            };
        case SET_CURRENT_LOCATION:
            return {
                ...state,
                currentLocation: {
                    ...action.location
                }
            };
        default:
            return state;
    }
}
