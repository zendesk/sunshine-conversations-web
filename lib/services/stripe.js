'use strict';

exports.__esModule = true;
exports.createTransaction = createTransaction;
exports.getAccount = getAccount;

var _appStateActions = require('../actions/app-state-actions');

var _core = require('./core');

var _user = require('./user');

function createTransaction(actionId, token) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.stripe.createTransaction((0, _user.getUserId)(getState()), actionId, token).catch(function (e) {
            dispatch((0, _appStateActions.showErrorNotification)(getState().ui.text.actionPaymentError));
            throw e;
        });
    };
}

function getAccount() {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).stripe.getAccount();
    };
}