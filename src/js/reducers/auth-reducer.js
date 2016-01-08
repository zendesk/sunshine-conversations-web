import { SET_AUTH, RESET_AUTH } from 'actions/auth-actions';
import { RESET } from 'actions/common-actions';

const INITIAL_STATE = {};

export function AuthReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);
        case SET_AUTH:
            return Object.assign({}, state, action.props);
        case RESET_AUTH:
            return INITIAL_STATE;
        default:
            return state;
    }
}
