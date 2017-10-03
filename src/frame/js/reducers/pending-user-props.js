import { RESET_PENDING_USER_PROPS, UPDATE_PENDING_USER_PROPS } from '../actions/user';
import { RESET } from '../actions/common';

const INITIAL_STATE = {};

export default function PendingUserReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);
        case UPDATE_PENDING_USER_PROPS:
            return Object.assign({}, state, action.properties);
        case RESET_PENDING_USER_PROPS:
            return INITIAL_STATE;
        default:
            return state;
    }
}
