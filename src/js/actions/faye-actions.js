export const SET_FAYE_CONVERSATION_SUBSCRIPTION = 'SET_FAYE_CONVERSATION_SUBSCRIPTION';
export const SET_FAYE_CONVERSATION_ACTIVITY_SUBSCRIPTION = 'SET_FAYE_CONVERSATION_ACTIVITY_SUBSCRIPTION';
export const SET_FAYE_USER_SUBSCRIPTION = 'SET_FAYE_USER_SUBSCRIPTION';
export const UNSET_FAYE_SUBSCRIPTIONS = 'UNSET_FAYE_SUBSCRIPTIONS';

export function setFayeConversationSubscription(subscription) {
    return {
        type: SET_FAYE_CONVERSATION_SUBSCRIPTION,
        subscription
    };
}

export function setFayeConversationActivitySubscription(subscription) {
    return {
        type: SET_FAYE_CONVERSATION_ACTIVITY_SUBSCRIPTION,
        subscription
    };
}

export function setFayeUserSubscription(subscription) {
    return {
        type: SET_FAYE_USER_SUBSCRIPTION,
        subscription
    };
}


export function unsetFayeSubscriptions() {
    return {
        type: UNSET_FAYE_SUBSCRIPTIONS
    };
}
