'use strict';

exports.__esModule = true;
exports.getClient = getClient;
exports.handleConversationSubscription = handleConversationSubscription;
exports.subscribeConversation = subscribeConversation;
exports.updateUser = updateUser;
exports.handleUserSubscription = handleUserSubscription;
exports.subscribeUser = subscribeUser;
exports.disconnectClient = disconnectClient;

var _faye = require('faye');

var _urljoin = require('urljoin');

var _urljoin2 = _interopRequireDefault(_urljoin);

var _appStore = require('../stores/app-store');

var _userActions = require('../actions/user-actions');

var _fayeActions = require('../actions/faye-actions');

var _conversationActions = require('../actions/conversation-actions');

var _conversationService = require('../services/conversation-service');

var _appService = require('../services/app-service');

var _device = require('./device');

var _styles = require('../constants/styles');

var _integrationsService = require('../services/integrations-service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = void 0;

function getClient() {
    if (!client) {
        (function () {
            var _store$getState = _appStore.store.getState();

            var appState = _store$getState.appState;
            var auth = _store$getState.auth;
            var user = _store$getState.user;

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
                var _store$getState2 = _appStore.store.getState();

                var user = _store$getState2.user;


                if (user.conversationStarted) {
                    (0, _conversationService.getConversation)();
                }
            });
        })();
    }

    return client;
}

function handleConversationSubscription(message) {
    if (message.source.id !== (0, _device.getDeviceId)()) {
        _appStore.store.dispatch((0, _conversationActions.addMessage)(message));

        if (message.role === 'appUser') {
            _appStore.store.dispatch((0, _conversationActions.resetUnreadCount)());
        }
    }

    if (message.role !== 'appUser') {
        _appStore.store.dispatch((0, _conversationActions.incrementUnreadCount)());
    }
}

function subscribeConversation() {
    var client = getClient();

    var _store$getState3 = _appStore.store.getState();

    var conversationId = _store$getState3.conversation._id;

    var subscription = client.subscribe('/v1/conversations/' + conversationId, handleConversationSubscription);

    return subscription.then(function () {
        _appStore.store.dispatch((0, _fayeActions.setFayeConversationSubscription)(subscription));
    });
}

function updateUser(currentAppUser, nextAppUser) {
    if (currentAppUser._id !== nextAppUser._id) {
        // take no chances, that user might already be linked and it would crash
        (0, _appService.hideChannelPage)();

        // Faye needs to be reconnected on the right user/conversation channels
        (0, _conversationService.disconnectFaye)();

        _appStore.store.dispatch((0, _userActions.setUser)(nextAppUser));
        subscribeUser().then(function () {
            if (nextAppUser.conversationStarted) {
                return (0, _conversationService.handleConversationUpdated)();
            }
        });
    } else {
        _appStore.store.dispatch((0, _userActions.setUser)(nextAppUser));

        if (currentAppUser.conversationStarted) {
            // if the conversation is already started,
            // fetch the conversation for merged messages
            (0, _conversationService.getConversation)();
        } else if (nextAppUser.conversationStarted) {
            // if the conversation wasn't already started,
            // `handleConversationUpdated` will connect faye and fetch it
            (0, _conversationService.handleConversationUpdated)();
        }
    }
}

function handleUserSubscription(_ref) {
    var appUser = _ref.appUser;
    var event = _ref.event;

    var _store$getState4 = _appStore.store.getState();

    var currentAppUser = _store$getState4.user;
    var visibleChannelType = _store$getState4.appState.visibleChannelType;


    if (event.type === 'link') {
        (0, _appService.hideConnectNotification)();

        var _appUser$clients$find = appUser.clients.find(function (c) {
            return c.id === event.clientId;
        });

        var platform = _appUser$clients$find.platform;

        if (platform === visibleChannelType) {
            (0, _appService.showSettings)();
            // add a delay to let the settings page animation finish
            // if it wasn't open already
            return setTimeout(function () {
                (0, _appService.hideChannelPage)();

                // add a delay to let the channel page hide, then update the user
                // why? React will just remove the channel page from the DOM if
                // we update the user right away.
                setTimeout(function () {
                    updateUser(currentAppUser, appUser);
                }, _styles.ANIMATION_TIMINGS.PAGE_TRANSITION);
            }, _styles.ANIMATION_TIMINGS.PAGE_TRANSITION);
        }
    } else if (event.type === 'link:cancelled') {
        var _appUser$pendingClien = appUser.pendingClients.find(function (c) {
            return c.id === event.clientId;
        });

        var _platform = _appUser$pendingClien.platform;

        if (_platform === 'twilio') {
            return (0, _integrationsService.cancelTwilioLink)();
        }
    }

    updateUser(currentAppUser, appUser);
}

function subscribeUser() {
    var client = getClient();

    var _store$getState5 = _appStore.store.getState();

    var user = _store$getState5.user;

    var subscription = client.subscribe('/v1/users/' + user._id, handleUserSubscription);

    return subscription.then(function () {
        _appStore.store.dispatch((0, _fayeActions.setFayeUserSubscription)(subscription));
    });
}

function disconnectClient() {
    if (client) {
        client.disconnect();
        client = undefined;
    }
}