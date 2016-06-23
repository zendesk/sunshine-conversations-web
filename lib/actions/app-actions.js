'use strict';

exports.__esModule = true;
exports.resetApp = resetApp;
exports.setApp = setApp;
exports.setStripeInfo = setStripeInfo;
var SET_APP = exports.SET_APP = 'SET_APP';
var SET_STRIPE_INFO = exports.SET_STRIPE_INFO = 'SET_STRIPE_INFO';
var RESET_APP = exports.RESET_APP = 'RESET_APP';

function resetApp() {
    return {
        type: RESET_APP
    };
}

function setApp(app) {
    return {
        type: SET_APP,
        app: app
    };
}

function setStripeInfo(props) {
    return {
        type: SET_STRIPE_INFO,
        props: props
    };
}