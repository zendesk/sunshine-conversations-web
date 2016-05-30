'use strict';

exports.__esModule = true;
exports.setFayeSubscription = setFayeSubscription;
exports.unsetFayeSubscription = unsetFayeSubscription;
var SET_FAYE_SUBSCRIPTION = exports.SET_FAYE_SUBSCRIPTION = 'SET_FAYE_SUBSCRIPTION';
var UNSET_FAYE_SUBSCRIPTION = exports.UNSET_FAYE_SUBSCRIPTION = 'UNSET_FAYE_SUBSCRIPTION';

function setFayeSubscription(subscription) {
    return {
        type: SET_FAYE_SUBSCRIPTION,
        subscription: subscription
    };
}

function unsetFayeSubscription() {
    return {
        type: UNSET_FAYE_SUBSCRIPTION
    };
}