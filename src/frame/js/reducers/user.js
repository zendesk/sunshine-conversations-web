import { SET_USER, RESET_USER, UPDATE_USER } from '../actions/user';
import { RESET } from '../actions/common';

const INITIAL_STATE = {};

export default function UserReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);
        case SET_USER:
            return Object.assign({}, action.user);
        case UPDATE_USER:
            return Object.assign({}, state, action.properties);
        case RESET_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
}
