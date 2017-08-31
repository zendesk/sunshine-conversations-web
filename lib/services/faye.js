'use strict';

exports.__esModule = true;
exports.getClient = getClient;
exports.handleConversationSubscription = handleConversationSubscription;
exports.subscribeConversation = subscribeConversation;
exports.handleConversationActivitySubscription = handleConversationActivitySubscription;
exports.subscribeConversationActivity = subscribeConversationActivity;
exports.updateUser = updateUser;
exports.handleUserSubscription = handleUserSubscription;
exports.subscribeUser = subscribeUser;
exports.disconnectClient = disconnectClient;

var _faye = require('faye');

var _urljoin = require('urljoin');

var _urljoin2 = _interopRequireDefault(_urljoin);

var _reduxBatchedActions = require('redux-batched-actions');

var _userActions = require('../actions/user-actions');

var _fayeActions = require('../actions/faye-actions');

var _conversationActions = require('../actions/conversation-actions');

var _conversation = require('./conversation');

var _app = require('./app');

var _device = require('../utils/device');

var _styles = require('../constants/styles');

var _integrations = require('./integrations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = void 0;

function getClient() {
    return function (dispatch, getState) {
        if (!client) {
            var _getState = getState(),
                appState = _getState.appState,
                auth = _getState.auth,
                user = _getState.user;

            client = new _faye.Client((0, _urljoin2.default)(appState.serverURL, 'faye'));

            client.addExtension({
                outgoing: function outgoing(message, callback) {
                    if (message.channel === '/meta/subscribe') {
                        message.ext = {
                            appUserId: user._id
                        };

                        if (auth.appToken) {
                            message.ext.appToken = auth.appToken;
                        }

                        if (auth.jwt) {
                            message.ext.jwt = auth.jwt;
                        }
                    }

                    callback(message);
                }
            });

            client.on('transport:up', function () {
                var _getState2 = getState(),
                    user = _getState2.user;

                if (user.conversationStarted) {
                    dispatch((0, _conversation.getMessages)());
                }
            });
        }

        return client;
    };
}

function handleConversationSubscription(message) {
    return function (dispatch) {
        if (message.source.id !== (0, _device.getDeviceId)()) {
            dispatch((0, _conversationActions.addMessage)(message));

            if (message.role === 'appUser') {
                dispatch((0, _conversationActions.resetUnreadCount)());
            }
        }

        if (message.role !== 'appUser') {
            dispatch((0, _conversationActions.incrementUnreadCount)());
        }
    };
}

function subscribeConversation() {
    return function (dispatch, getState) {
        var client = dispatch(getClient());

        var _getState3 = getState(),
            conversationId = _getState3.conversation._id;

        var subscription = client.subscribe('/v1/conversations/' + conversationId, function (message) {
            dispatch(handleConversationSubscription(message));
        });

        return subscription.then(function () {
            return dispatch((0, _fayeActions.setFayeConversationSubscription)(subscription));
        });
    };
}

function handleConversationActivitySubscription(_ref) {
    var activity = _ref.activity,
        role = _ref.role,
        _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data;

    return function (dispatch) {
        if (role === 'appMaker') {
            // Web Messenger only handles appMaker activities for now

            switch (activity) {
                case 'typing:start':
                    return dispatch((0, _app.showTypingIndicator)(data));
                case 'typing:stop':
                    return dispatch((0, _app.hideTypingIndicator)());
            }
        }
    };
}

function subscribeConversationActivity() {
    return function (dispatch, getState) {
        var client = dispatch(getClient());

        var _getState4 = getState(),
            conversationId = _getState4.conversation._id;

        var subscription = client.subscribe('/v1/conversations/' + conversationId + '/activity', function (message) {
            dispatch(handleConversationActivitySubscription(message));
        });

        return subscription.then(function () {
            return dispatch((0, _fayeActions.setFayeConversationActivitySubscription)(subscription));
        });
    };
}

function updateUser(currentAppUser, nextAppUser) {
    return function (dispatch) {
        if (currentAppUser._id !== nextAppUser._id) {
            // take no chances, that user might already be linked and it would crash
            dispatch((0, _reduxBatchedActions.batchActions)([(0, _app.hideChannelPage)(), (0, _userActions.setUser)(nextAppUser)]));

            // Faye needs to be reconnected on the right user/conversation channels
            (0, _conversation.disconnectFaye)();

            return dispatch(subscribeUser()).then(function () {
                if (nextAppUser.conversationStarted) {
                    return dispatch((0, _conversation.handleConversationUpdated)());
                }
            });
        } else {
            dispatch((0, _userActions.setUser)(nextAppUser));

            if (currentAppUser.conversationStarted) {
                // if the conversation is already started,
                // fetch the conversation for merged messages
                return dispatch((0, _conversation.getMessages)());
            } else if (nextAppUser.conversationStarted) {
                // if the conversation wasn't already started,
                // `handleConversationUpdated` will connect faye and fetch it
                return dispatch((0, _conversation.handleConversationUpdated)());
            }
        }
    };
}

function handleUserSubscription(_ref2) {
    var appUser = _ref2.appUser,
        event = _ref2.event;

    return function (dispatch, getState) {
        var _getState5 = getState(),
            currentAppUser = _getState5.user,
            visibleChannelType = _getState5.appState.visibleChannelType;

        if (event.type === 'link') {
            dispatch((0, _app.hideConnectNotification)());

            var _appUser$clients$find = appUser.clients.find(function (c) {
                return c.id === event.clientId;
            }),
                platform = _appUser$clients$find.platform;

            if (platform === visibleChannelType) {
                dispatch((0, _app.showSettings)());
                // add a delay to let the settings page animation finish
                // if it wasn't open already
                return setTimeout(function () {
                    dispatch((0, _app.hideChannelPage)());

                    // add a delay to let the channel page hide, then update the user
                    // why? React will just remove the channel page from the DOM if
                    // we update the user right away.
                    setTimeout(function () {
                        dispatch(updateUser(currentAppUser, appUser));
                    }, _styles.ANIMATION_TIMINGS.PAGE_TRANSITION);
                }, _styles.ANIMATION_TIMINGS.PAGE_TRANSITION);
            }
        } else if (event.type === 'link:cancelled') {
            var _appUser$pendingClien = appUser.pendingClients.find(function (c) {
                return c.id === event.clientId;
            }),
                _platform = _appUser$pendingClien.platform;

            if (_platform === 'twilio' || _platform === 'messagebird') {
                return dispatch((0, _integrations.cancelSMSLink)(_platform));
            }
        } else if (event.type === 'link:failed') {
            var pendingClient = currentAppUser.pendingClients.find(function (c) {
                return c.id === event.clientId;
            });

            if (pendingClient && (pendingClient.platform === 'twilio' || pendingClient.platform === 'messagebird')) {
                return dispatch((0, _integrations.failSMSLink)(event.err, pendingClient.platform));
            }
        } else if (event.type === 'link:failed') {
            var _pendingClient = currentAppUser.pendingClients.find(function (c) {
                return c.id === event.clientId;
            });

            if (_pendingClient && _pendingClient.platform === 'twilio') {
                return dispatch((0, _integrations.failSMSLink)(event.err));
            }
        }

        return dispatch(updateUser(currentAppUser, appUser));
    };
}

function subscribeUser() {
    return function (dispatch, getState) {
        var client = dispatch(getClient());

        var _getState6 = getState(),
            user = _getState6.user;

        var subscription = client.subscribe('/v1/users/' + user._id, function (message) {
            dispatch(handleUserSubscription(message));
        });

        return subscription.then(function () {
            return dispatch((0, _fayeActions.setFayeUserSubscription)(subscription));
        });
    };
}

function disconnectClient() {
    if (client) {
        client.disconnect();
        client = undefined;
    }
}