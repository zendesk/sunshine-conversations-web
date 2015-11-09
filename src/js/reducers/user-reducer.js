import { SET_USER, RESET_USER } from '../actions/user-actions';

const INITIAL_STATE = {};

export function UserReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_USER:
            return Object.assign({}, action.user)
        case RESET_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
}
