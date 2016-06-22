import { SET_FAYE_CONVERSATION_SUBSCRIPTION, SET_FAYE_USER_SUBSCRIPTION, UNSET_FAYE_SUBSCRIPTIONS } from '../actions/faye-actions';
import { RESET } from '../actions/common-actions';

const INITIAL_STATE = {};

export function FayeReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);
        case SET_FAYE_CONVERSATION_SUBSCRIPTION:
            return Object.assign({}, state, {
                conversationSubscription: action.subscription
            });
        case SET_FAYE_USER_SUBSCRIPTION:
            return Object.assign({}, state, {
                userSubscription: action.subscription
            });
        case UNSET_FAYE_SUBSCRIPTIONS:
            return Object.assign({}, state, {
                conversationSubscription: undefined,
                userSubscription: undefined
            });
        default:
            return state;
    }
}
