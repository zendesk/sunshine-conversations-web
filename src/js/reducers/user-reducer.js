import { SET_USER, RESET_USER } from 'actions/user-actions';
import { RESET } from 'actions/common-actions';

const INITIAL_STATE = {};

export function UserReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);
        case SET_USER:
            return Object.assign({}, action.user);
        case RESET_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
}
