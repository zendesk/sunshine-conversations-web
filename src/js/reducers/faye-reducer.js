import { SET_FAYE_SUBSCRIPTION, UNSET_FAYE_SUBSCRIPTION } from 'actions/faye-actions';

const INITIAL_STATE = {};

export function FayeReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_FAYE_SUBSCRIPTION:
            return Object.assign({}, state, {
                subscription: action.subscription
            });
        case UNSET_FAYE_SUBSCRIPTION:
            return Object.assign({}, state, {
                subscription: undefined
            });
        default:
            return state;
    }
}
