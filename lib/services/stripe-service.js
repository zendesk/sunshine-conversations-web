'use strict';

exports.__esModule = true;
exports.createTransaction = createTransaction;
exports.getAccount = getAccount;

var _appStore = require('../stores/app-store');

var _appStateActions = require('../actions/app-state-actions');

var _core = require('./core');

var _userService = require('./user-service');

function createTransaction(actionId, token) {
    return (0, _core.core)().appUsers.stripe.createTransaction((0, _userService.getUserId)(), actionId, token).catch(function (e) {
        _appStore.store.dispatch((0, _appStateActions.showErrorNotification)(_appStore.store.getState().ui.text.actionPaymentError));
        throw e;
    });
}

function getAccount() {
    return (0, _core.core)().stripe.getAccount();
}