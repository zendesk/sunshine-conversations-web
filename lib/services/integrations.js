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
exports.fetchTransferRequestCode = fetchTransferRequestCode;

var _reduxBatchedActions = require('redux-batched-actions');

var _core = require('./core');

var _integrationsActions = require('../actions/integrations-actions');

var _conversation = require('./conversation');

var _user = require('./user');

var _userActions = require('../actions/user-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchingWeChat = false;
var fetchingViber = false;

function fetchWeChatQRCode() {
    return function (dispatch, getState) {
        var _getState = getState(),
            wechat = _getState.integrations.wechat;

        if (wechat.qrCode || fetchingWeChat) {
            return _promise2.default.resolve();
        }

        dispatch((0, _integrationsActions.unsetError)('wechat'));
        fetchingWeChat = true;
        return (0, _core.core)(getState()).appUsers.wechat.getQRCode((0, _user.getUserId)(getState())).then(function (_ref) {
            var url = _ref.url;

            dispatch((0, _integrationsActions.setWeChatQRCode)(url));
        }).catch(function () {
            dispatch((0, _integrationsActions.setError)('wechat'));
        }).then(function () {
            fetchingWeChat = false;
        });
    };
}

function updateTwilioAttributes(attr) {
    return function (dispatch) {
        dispatch((0, _integrationsActions.setTwilioIntegrationState)(attr));
    };
}

function resetTwilioAttributes() {
    return function (dispatch) {
        dispatch((0, _integrationsActions.resetTwilioIntegrationState)());
    };
}

function fetchTwilioAttributes() {
    return function (dispatch, getState) {
        var _getState2 = getState(),
            _getState2$user = _getState2.user,
            clients = _getState2$user.clients,
            pendingClients = _getState2$user.pendingClients;

        var client = clients.find(function (client) {
            return client.platform === 'twilio';
        });
        var pendingClient = pendingClients.find(function (client) {
            return client.platform === 'twilio';
        });

        if (client) {
            dispatch(updateTwilioAttributes({
                linkState: 'linked',
                appUserNumber: client.displayName
            }));
        } else if (pendingClient) {
            dispatch(updateTwilioAttributes({
                linkState: 'pending',
                appUserNumber: pendingClient.displayName
            }));
        }
    };
}

function linkTwilioChannel(userId, data) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.linkChannel(userId, data).then(function (_ref2) {
            var appUser = _ref2.appUser;

            dispatch((0, _userActions.updateUser)(appUser));

            if (appUser.conversationStarted) {
                return dispatch((0, _conversation.handleConversationUpdated)());
            }
        }).then(function () {
            dispatch(updateTwilioAttributes({
                linkState: 'pending'
            }));
        }).catch(function (e) {
            var _getState3 = getState(),
                _getState3$ui$text = _getState3.ui.text,
                smsTooManyRequestsError = _getState3$ui$text.smsTooManyRequestsError,
                smsTooManyRequestsOneMinuteError = _getState3$ui$text.smsTooManyRequestsOneMinuteError,
                smsBadRequestError = _getState3$ui$text.smsBadRequestError,
                smsUnhandledError = _getState3$ui$text.smsUnhandledError;

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

            dispatch(updateTwilioAttributes({
                hasError: true,
                errorMessage: errorMessage
            }));
        });
    };
}

function unlinkTwilioChannel(userId) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.unlinkChannel(userId, 'twilio').then(function () {
            var _getState4 = getState(),
                _getState4$user = _getState4.user,
                clients = _getState4$user.clients,
                pendingClients = _getState4$user.pendingClients;

            dispatch((0, _userActions.updateUser)({
                pendingClients: pendingClients.filter(function (pendingClient) {
                    return pendingClient.platform !== 'twilio';
                }),
                clients: clients.filter(function (client) {
                    return client.platform !== 'twilio';
                })
            }));
        }).then(function () {
            dispatch(updateTwilioAttributes({
                linkState: 'unlinked',
                appUserNumber: '',
                appUserNumberValid: false
            }));
        }).catch(function (e) {
            var status = e.response.status;

            var _getState5 = getState(),
                smsBadRequestError = _getState5.ui.text.smsBadRequestError;
            // Deleting a client that was never linked


            if (status === 400) {
                dispatch(updateTwilioAttributes({
                    linkState: 'unlinked'
                }));
            } else {
                dispatch(updateTwilioAttributes({
                    linkState: 'unlinked',
                    hasError: true,
                    errorMessage: smsBadRequestError
                }));
            }
        });
    };
}

function pingTwilioChannel(userId) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.pingChannel(userId, 'twilio').then(function () {
            dispatch(updateTwilioAttributes({
                linkState: 'linked'
            }));
        }).catch(function () {
            var _getState6 = getState(),
                smsPingChannelError = _getState6.ui.text.smsPingChannelError;

            dispatch(updateTwilioAttributes({
                hasError: true,
                errorMessage: smsPingChannelError
            }));
        });
    };
}

function cancelTwilioLink() {
    return function (dispatch, getState) {
        var _getState7 = getState(),
            pendingClients = _getState7.user.pendingClients,
            appUserNumber = _getState7.integrations.twilio.appUserNumber,
            smsLinkCancelled = _getState7.ui.text.smsLinkCancelled;

        dispatch((0, _reduxBatchedActions.batchActions)([(0, _userActions.updateUser)({
            pendingClients: pendingClients.filter(function (pendingClient) {
                return pendingClient.platform !== 'twilio';
            })
        }), updateTwilioAttributes({
            linkState: 'unlinked',
            hasError: true,
            errorMessage: smsLinkCancelled.replace('{appUserNumber}', appUserNumber)
        })]));
    };
}

function fetchViberQRCode() {
    return function (dispatch, getState) {
        var _getState8 = getState(),
            viber = _getState8.integrations.viber;

        if (viber.qrCode || fetchingViber) {
            return _promise2.default.resolve();
        }

        dispatch((0, _integrationsActions.unsetError)('viber'));
        fetchingViber = true;
        return (0, _core.core)(getState()).appUsers.viber.getQRCode((0, _user.getUserId)(getState())).then(function (_ref3) {
            var url = _ref3.url;

            dispatch((0, _integrationsActions.setViberQRCode)(url));
        }).catch(function () {
            dispatch((0, _integrationsActions.setError)('viber'));
        }).then(function () {
            fetchingViber = false;
        });
    };
}

function fetchTransferRequestCode(channel) {
    return function (dispatch, getState) {
        var userId = (0, _user.getUserId)(getState());
        dispatch((0, _integrationsActions.unsetError)(channel));
        return (0, _core.core)(getState()).appUsers.transferRequest(userId, {
            type: channel
        }).then(function (res) {
            var transferRequestCode = res.transferRequests[0].code;
            dispatch((0, _integrationsActions.setTransferRequestCode)(channel, transferRequestCode));
        }).catch(function () {
            dispatch((0, _integrationsActions.setError)(channel));
        });
    };
}