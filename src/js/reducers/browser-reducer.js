import { SET_HAS_FOCUS } from 'actions/browser-actions';
import { RESET } from 'actions/common-actions';

const INITIAL_STATE = {
    hasFocus: false
};

export function BrowserReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);
        case SET_HAS_FOCUS:
            return Object.assign({}, state, {
                hasFocus: action.hasFocus
            });
        default:
            return state;
    }
}
