import { SET_FAYE_SUBSCRIPTION, UNSET_FAYE_SUBSCRIPTION } from '../actions/faye';
import { RESET } from '../actions/common';

const INITIAL_STATE = {
    subscription: undefined
};

export default function FayeReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return {
                ...INITIAL_STATE
            };
        case SET_FAYE_SUBSCRIPTION:
            return {
                ...state,
                subscription: action.subscription
            };
        case UNSET_FAYE_SUBSCRIPTION:
            return {
                ...state,
                subscription: undefined
            };
        default:
            return state;
    }
}
