import { SET_AUTH, RESET_AUTH, SET_USER, RESET_USER } from '../actions/auth-actions';

const INITIAL_STATE = {
    auth: {},
    user: {}
};

export function AuthReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_AUTH:
            return Object.assign({}, state, { auth: action.props})
        case RESET_AUTH:
            return Object.assign({}, state, { auth: INITIAL_STATE.auth})
        case SET_USER:
            return Object.assign({}, state, { user: action.user})
        case RESET_USER:
            return Object.assign({}, state, { user: INITIAL_STATE.user})
        default:
            return state;
    }
}
