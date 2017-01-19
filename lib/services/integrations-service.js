'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.fetchWeChatQRCode = fetchWeChatQRCode;
exports.updateTwilioAttributes = updateTwilioAttributes;
exports.resetTwilioAttributes = resetTwilioAttributes;
exports.fetchTwilioAttributes = fetchTwilioAttributes;
exports.linkTwilioChannel = linkTwilioChannel;
exports.unlinkTwilioChannel = unlinkTwilioChannel;
exports.pingTwilioChannel = pingTwilioChannel;
exports.cancelTwilioLink = cancelTwilioLink;
exports.fetchViberQRCode = fetchViberQRCode;

var _appStore = require('../stores/app-store');

var _core = require('./core');

var _integrationsActions = require('../actions/integrations-actions');

var _conversationService = require('./conversation-service');

var _userService = require('./user-service');

var _userActions = require('../actions/user-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchingWeChat = false;
var fetchingViber = false;

function fetchWeChatQRCode() {
    var _store$getState = _appStore.store.getState(),
        wechat = _store$getState.integrations.wechat;

    if (wechat.qrCode || fetchingWeChat) {
        return _promise2.default.resolve();
    }

    _appStore.store.dispatch((0, _integrationsActions.unsetWeChatError)());
    fetchingWeChat = true;
    return (0, _core.core)().appUsers.wechat.getQRCode((0, _userService.getUserId)()).then(function (_ref) {
        var url = _ref.url;

        _appStore.store.dispatch((0, _integrationsActions.setWeChatQRCode)(url));
    }).catch(function () {
        _appStore.store.dispatch((0, _integrationsActions.setWeChatError)());
    }).then(function () {
        fetchingWeChat = false;
    });
}

function updateTwilioAttributes(attr) {
    _appStore.store.dispatch((0, _integrationsActions.setTwilioIntegrationState)(attr));
}

function resetTwilioAttributes() {
    _appStore.store.dispatch((0, _integrationsActions.resetTwilioIntegrationState)());
}

function fetchTwilioAttributes() {
    var _store$getState2 = _appStore.store.getState(),
        _store$getState2$user = _store$getState2.user,
        clients = _store$getState2$user.clients,
        pendingClients = _store$getState2$user.pendingClients;

    var client = clients.find(function (client) {
        return client.platform === 'twilio';
    });
    var pendingClient = pendingClients.find(function (client) {
        return client.platform === 'twilio';
    });

    if (client) {
        updateTwilioAttributes({
            linkState: 'linked',
            appUserNumber: client.displayName
        });
    } else if (pendingClient) {
        updateTwilioAttributes({
            linkState: 'pending',
            appUserNumber: pendingClient.displayName
        });
    }
}

function linkTwilioChannel(userId, data) {
    return (0, _core.core)().appUsers.linkChannel(userId, data).then(function (_ref2) {
        var appUser = _ref2.appUser;

        _appStore.store.dispatch((0, _userActions.updateUser)(appUser));

        if (appUser.conversationStarted) {
            return (0, _conversationService.handleConversationUpdated)();
        }
    }).then(function () {
        updateTwilioAttributes({
            linkState: 'pending'
        });
    }).catch(function (e) {
        var _store$getState3 = _appStore.store.getState(),
            _store$getState3$ui$t = _store$getState3.ui.text,
            smsTooManyRequestsError = _store$getState3$ui$t.smsTooManyRequestsError,
            smsTooManyRequestsOneMinuteError = _store$getState3$ui$t.smsTooManyRequestsOneMinuteError,
            smsBadRequestError = _store$getState3$ui$t.smsBadRequestError,
            smsUnhandledError = _store$getState3$ui$t.smsUnhandledError;

        var status = e.response.status;

        var errorMessage = void 0;

        if (status === 429) {
            var minutes = Math.ceil(e.response.headers.get('retry-after') / 60);
            if (minutes > 1) {
                errorMessage = smsTooManyRequestsError.replace('{minutes}', minutes);
            } else {
                errorMessage = smsTooManyRequestsOneMinuteError;
            }
        } else if (status > 499) {
            errorMessage = smsUnhandledError;
        } else {
            errorMessage = smsBadRequestError;
        }

        updateTwilioAttributes({
            hasError: true,
            errorMessage: errorMessage
        });
    });
}

function unlinkTwilioChannel(userId) {
    return (0, _core.core)().appUsers.unlinkChannel(userId, 'twilio').then(function () {
        var _store$getState4 = _appStore.store.getState(),
            _store$getState4$user = _store$getState4.user,
            clients = _store$getState4$user.clients,
            pendingClients = _store$getState4$user.pendingClients;

        _appStore.store.dispatch((0, _userActions.updateUser)({
            pendingClients: pendingClients.filter(function (pendingClient) {
                return pendingClient.platform !== 'twilio';
            }),
            clients: clients.filter(function (client) {
                return client.platform !== 'twilio';
            })
        }));
    }).then(function () {
        updateTwilioAttributes({
            linkState: 'unlinked',
            appUserNumber: '',
            appUserNumberValid: false
        });
    }).catch(function (e) {
        var status = e.response.status;

        var _store$getState5 = _appStore.store.getState(),
            smsBadRequestError = _store$getState5.ui.text.smsBadRequestError;
        // Deleting a client that was never linked


        if (status === 400) {
            updateTwilioAttributes({
                linkState: 'unlinked'
            });
        } else {
            updateTwilioAttributes({
                linkState: 'unlinked',
                hasError: true,
                errorMessage: smsBadRequestError
            });
        }
    });
}

function pingTwilioChannel(userId) {
    return (0, _core.core)().appUsers.pingChannel(userId, 'twilio').then(function () {
        updateTwilioAttributes({
            linkState: 'linked'
        });
    }).catch(function () {
        var _store$getState6 = _appStore.store.getState(),
            smsPingChannelError = _store$getState6.ui.text.smsPingChannelError;

        updateTwilioAttributes({
            hasError: true,
            errorMessage: smsPingChannelError
        });
    });
}

function cancelTwilioLink() {
    var _store$getState7 = _appStore.store.getState(),
        pendingClients = _store$getState7.user.pendingClients,
        appUserNumber = _store$getState7.integrations.twilio.appUserNumber,
        smsLinkCancelled = _store$getState7.ui.text.smsLinkCancelled;

    _appStore.store.dispatch((0, _userActions.updateUser)({
        pendingClients: pendingClients.filter(function (pendingClient) {
            return pendingClient.platform !== 'twilio';
        })
    }));

    updateTwilioAttributes({
        linkState: 'unlinked',
        hasError: true,
        errorMessage: smsLinkCancelled.replace('{appUserNumber}', appUserNumber)
    });
}

function fetchViberQRCode() {
    var _store$getState8 = _appStore.store.getState(),
        viber = _store$getState8.integrations.viber;

    if (viber.qrCode || fetchingViber) {
        return _promise2.default.resolve();
    }

    _appStore.store.dispatch((0, _integrationsActions.unsetViberError)());
    fetchingViber = true;
    return (0, _core.core)().appUsers.viber.getQRCode((0, _userService.getUserId)()).then(function (_ref3) {
        var url = _ref3.url;

        _appStore.store.dispatch((0, _integrationsActions.setViberQRCode)(url));
    }).catch(function () {
        _appStore.store.dispatch((0, _integrationsActions.setViberError)());
    }).then(function () {
        fetchingViber = false;
    });
}