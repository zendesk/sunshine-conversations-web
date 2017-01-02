'use strict';

exports.__esModule = true;
exports.setFayeConversationSubscription = setFayeConversationSubscription;
exports.setFayeConversationActivitySubscription = setFayeConversationActivitySubscription;
exports.setFayeUserSubscription = setFayeUserSubscription;
exports.unsetFayeSubscriptions = unsetFayeSubscriptions;
var SET_FAYE_CONVERSATION_SUBSCRIPTION = exports.SET_FAYE_CONVERSATION_SUBSCRIPTION = 'SET_FAYE_CONVERSATION_SUBSCRIPTION';
var SET_FAYE_CONVERSATION_ACTIVITY_SUBSCRIPTION = exports.SET_FAYE_CONVERSATION_ACTIVITY_SUBSCRIPTION = 'SET_FAYE_CONVERSATION_ACTIVITY_SUBSCRIPTION';
var SET_FAYE_USER_SUBSCRIPTION = exports.SET_FAYE_USER_SUBSCRIPTION = 'SET_FAYE_USER_SUBSCRIPTION';
var UNSET_FAYE_SUBSCRIPTIONS = exports.UNSET_FAYE_SUBSCRIPTIONS = 'UNSET_FAYE_SUBSCRIPTIONS';

function setFayeConversationSubscription(subscription) {
    return {
        type: SET_FAYE_CONVERSATION_SUBSCRIPTION,
        subscription: subscription
    };
}

function setFayeConversationActivitySubscription(subscription) {
    return {
        type: SET_FAYE_CONVERSATION_ACTIVITY_SUBSCRIPTION,
        subscription: subscription
    };
}

function setFayeUserSubscription(subscription) {
    return {
        type: SET_FAYE_USER_SUBSCRIPTION,
        subscription: subscription
    };
}

function unsetFayeSubscriptions() {
    return {
        type: UNSET_FAYE_SUBSCRIPTIONS
    };
}