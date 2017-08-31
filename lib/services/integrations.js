'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.fetchWeChatQRCode = fetchWeChatQRCode;
exports.updateSMSAttributes = updateSMSAttributes;
exports.updateTwilioAttributes = updateTwilioAttributes;
exports.updateMessageBirdAttributes = updateMessageBirdAttributes;
exports.resetSMSAttributes = resetSMSAttributes;
exports.resetTwilioAttributes = resetTwilioAttributes;
exports.resetMessageBirdAttributes = resetMessageBirdAttributes;
exports.fetchTwilioAttributes = fetchTwilioAttributes;
exports.fetchMessageBirdAttributes = fetchMessageBirdAttributes;
exports.linkSMSChannel = linkSMSChannel;
exports.unlinkSMSChannel = unlinkSMSChannel;
exports.pingSMSChannel = pingSMSChannel;
exports.cancelSMSLink = cancelSMSLink;
exports.failSMSLink = failSMSLink;
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

function handleLinkFailure(error, type) {
    return function (dispatch, getState) {
        var _getState = getState(),
            _getState$ui$text = _getState.ui.text,
            smsTooManyRequestsError = _getState$ui$text.smsTooManyRequestsError,
            smsTooManyRequestsOneMinuteError = _getState$ui$text.smsTooManyRequestsOneMinuteError,
            smsBadRequestError = _getState$ui$text.smsBadRequestError,
            smsUnhandledError = _getState$ui$text.smsUnhandledError;

        var retryAfter = error.headers ? error.headers.get('retry-after') : error.retryAfter;
        var status = error.status;

        var errorMessage = void 0;

        if (status === 429) {
            var minutes = Math.ceil(retryAfter / 60);
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
            linkState: 'unlinked',
            errorMessage: errorMessage
        }));
    };
}

function fetchWeChatQRCode() {
    return function (dispatch, getState) {
        var _getState2 = getState(),
            wechat = _getState2.integrations.wechat;

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

var smsFunctionMap = {
    twilio: {
        updateSMSAttributes: updateTwilioAttributes,
        resetSMSAttributes: resetTwilioAttributes
    },
    messagebird: {
        updateSMSAttributes: updateMessageBirdAttributes,
        resetSMSAttributes: resetMessageBirdAttributes
    }
};

function updateSMSAttributes(attr, type) {
    return smsFunctionMap[type].updateSMSAttributes(attr);
}

function updateTwilioAttributes(attr) {
    return function (dispatch) {
        dispatch((0, _integrationsActions.setTwilioIntegrationState)(attr));
    };
}

function updateMessageBirdAttributes(attr) {
    return function (dispatch) {
        dispatch((0, _integrationsActions.setMessageBirdIntegrationState)(attr));
    };
}

function resetSMSAttributes(type) {
    return smsFunctionMap[type].resetSMSAttributes();
}

function resetTwilioAttributes() {
    return function (dispatch) {
        dispatch((0, _integrationsActions.resetTwilioIntegrationState)());
    };
}

function resetMessageBirdAttributes() {
    return function (dispatch) {
        dispatch((0, _integrationsActions.resetMessageBirdIntegrationState)());
    };
}

function fetchTwilioAttributes() {
    return function (dispatch, getState) {
        var _getState3 = getState(),
            _getState3$user = _getState3.user,
            clients = _getState3$user.clients,
            pendingClients = _getState3$user.pendingClients;

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

function fetchMessageBirdAttributes() {
    return function (dispatch, getState) {
        var _getState4 = getState(),
            _getState4$user = _getState4.user,
            clients = _getState4$user.clients,
            pendingClients = _getState4$user.pendingClients;

        var client = clients.find(function (client) {
            return client.platform === 'messagebird';
        });
        var pendingClient = pendingClients.find(function (client) {
            return client.platform === 'messagebird';
        });

        if (client) {
            dispatch(updateMessageBirdAttributes({
                linkState: 'linked',
                appUserNumber: client.displayName
            }));
        } else if (pendingClient) {
            dispatch(updateMessageBirdAttributes({
                linkState: 'pending',
                appUserNumber: pendingClient.displayName
            }));
        }
    };
}

function linkSMSChannel(userId, data) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.linkChannel(userId, data).then(function (_ref2) {
            var appUser = _ref2.appUser;

            dispatch((0, _userActions.updateUser)(appUser));

            if (appUser.conversationStarted) {
                return dispatch((0, _conversation.handleConversationUpdated)());
            }
        }).then(function () {
            dispatch(updateSMSAttributes({
                linkState: 'pending'
            }, data.type));
        }).catch(function (e) {
            dispatch(handleLinkFailure(e.response, data.type));
        });
    };
}

function unlinkSMSChannel(userId, type) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.unlinkChannel(userId, type).then(function () {
            var _getState5 = getState(),
                _getState5$user = _getState5.user,
                clients = _getState5$user.clients,
                pendingClients = _getState5$user.pendingClients;

            dispatch((0, _userActions.updateUser)({
                pendingClients: pendingClients.filter(function (pendingClient) {
                    return pendingClient.platform !== type;
                }),
                clients: clients.filter(function (client) {
                    return client.platform !== type;
                })
            }));
        }).then(function () {
            dispatch(updateSMSAttributes({
                linkState: 'unlinked',
                appUserNumber: '',
                appUserNumberValid: false
            }, type));
        }).catch(function (e) {
            var status = e.response.status;

            var _getState6 = getState(),
                smsBadRequestError = _getState6.ui.text.smsBadRequestError;
            // Deleting a client that was never linked


            if (status === 400) {
                dispatch(updateSMSAttributes({
                    linkState: 'unlinked'
                }, type));
            } else {
                dispatch(updateSMSAttributes({
                    linkState: 'unlinked',
                    hasError: true,
                    errorMessage: smsBadRequestError
                }, type));
            }
        });
    };
}

function pingSMSChannel(userId, type) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.pingChannel(userId, type).then(function () {
            dispatch(updateSMSAttributes({
                linkState: 'linked'
            }, type));
        }).catch(function () {
            var _getState7 = getState(),
                smsPingChannelError = _getState7.ui.text.smsPingChannelError;

            dispatch(updateSMSAttributes({
                hasError: true,
                errorMessage: smsPingChannelError
            }, type));
        });
    };
}

function cancelSMSLink(type) {
    return function (dispatch, getState) {
        var _getState8 = getState(),
            pendingClients = _getState8.user.pendingClients,
            integrations = _getState8.integrations,
            smsLinkCancelled = _getState8.ui.text.smsLinkCancelled;

        var appUserNumber = integrations[type].appUserNumber;

        dispatch((0, _reduxBatchedActions.batchActions)([(0, _userActions.updateUser)({
            pendingClients: pendingClients.filter(function (pendingClient) {
                return pendingClient.platform !== type;
            })
        }), updateSMSAttributes({
            linkState: 'unlinked',
            hasError: true,
            errorMessage: smsLinkCancelled.replace('{appUserNumber}', appUserNumber)
        }, type)]));
    };
}

function failSMSLink(error, type) {
    return function (dispatch) {
        dispatch(handleLinkFailure(error, type));
    };
}

function fetchViberQRCode() {
    return function (dispatch, getState) {
        var _getState9 = getState(),
            viber = _getState9.integrations.viber;

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