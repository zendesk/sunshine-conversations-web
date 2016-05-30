'use strict';

exports.__esModule = true;
exports.setPublicKeys = setPublicKeys;
exports.resetApp = resetApp;
exports.setStripeInfo = setStripeInfo;
exports.setAppSettings = setAppSettings;
var SET_STRIPE_INFO = exports.SET_STRIPE_INFO = 'SET_STRIPE_INFO';
var SET_PUBLIC_KEYS = exports.SET_PUBLIC_KEYS = 'SET_PUBLIC_KEYS';
var SET_APP_SETTINGS = exports.SET_APP_SETTINGS = 'SET_APP_SETTINGS';
var RESET_APP = exports.RESET_APP = 'RESET_APP';

function setPublicKeys() {
    var keys = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return {
        type: SET_PUBLIC_KEYS,
        keys: keys
    };
}

function resetApp() {
    return {
        type: RESET_APP
    };
}

function setStripeInfo(props) {
    return {
        type: SET_STRIPE_INFO,
        props: props
    };
}

function setAppSettings() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (!props.web) {
        props.web = {};
    }

    return {
        type: SET_APP_SETTINGS,
        props: props
    };
}