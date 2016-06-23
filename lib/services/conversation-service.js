'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.handleConnectNotification = handleConnectNotification;
exports.sendChain = sendChain;
exports.sendMessage = sendMessage;
exports.uploadImage = uploadImage;
exports.getConversation = getConversation;
exports.connectFayeConversation = connectFayeConversation;
exports.connectFayeUser = connectFayeUser;
exports.disconnectFaye = disconnectFaye;
exports.resetUnreadCount = resetUnreadCount;
exports.handleConversationUpdated = handleConversationUpdated;
exports.postPostback = postPostback;

var _appStore = require('../stores/app-store');

var _appService = require('../services/app-service');

var _conversationActions = require('../actions/conversation-actions');

var _userActions = require('../actions/user-actions');

var _appStateActions = require('../actions/app-state-actions');

var _fayeActions = require('../actions/faye-actions');

var _core = require('./core');

var _userService = require('./user-service');

var _faye = require('../utils/faye');

var _events = require('../utils/events');

var _media = require('../utils/media');

var _device = require('../utils/device');

var _user = require('../utils/user');

var _notifications = require('../constants/notifications');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleConnectNotification(response) {
    var _store$getState = _appStore.store.getState();

    var _store$getState$user = _store$getState.user;
    var clients = _store$getState$user.clients;
    var email = _store$getState$user.email;
    var _store$getState$app = _store$getState.app;
    var integrations = _store$getState$app.integrations;
    var settings = _store$getState$app.settings;
    var messages = _store$getState.conversation.messages;
    var emailCaptureEnabled = _store$getState.appState.emailCaptureEnabled;

    var appUserMessages = messages.filter(function (message) {
        return message.role === 'appUser';
    });

    var channelsAvailable = (0, _user.hasLinkableChannels)(integrations, clients, settings.web);
    var showEmailCapture = emailCaptureEnabled && !email;
    var hasSomeChannelLinked = (0, _user.getLinkableChannels)(integrations, settings.web).some(function (channelType) {
        return (0, _user.isChannelLinked)(clients, channelType);
    });

    if ((showEmailCapture || channelsAvailable) && !hasSomeChannelLinked) {
        if (appUserMessages.length === 1) {
            (0, _appService.showConnectNotification)();
        } else {
            // find the last confirmed message timestamp
            var lastMessageTimestamp = void 0;

            // start at -2 to ignore the message that was just sent
            for (var index = appUserMessages.length - 2; index >= 0 && !lastMessageTimestamp; index--) {
                var message = appUserMessages[index];
                lastMessageTimestamp = message.received;
            }

            if (lastMessageTimestamp) {
                // divide it by 1000 since server `received` is in seconds and not in ms
                var currentTimeStamp = Date.now() / 1000;
                if (currentTimeStamp - lastMessageTimestamp >= _notifications.CONNECT_NOTIFICATION_DELAY_IN_SECONDS) {
                    (0, _appService.showConnectNotification)();
                }
            }
        }
    }

    return response;
}

function sendChain(sendFn) {
    var promise = (0, _userService.immediateUpdate)(_appStore.store.getState().user);

    if (_appStore.store.getState().user.conversationStarted) {
        return promise.then(connectFayeConversation).then(sendFn).then(handleConnectNotification);
    }

    // if it's not started, send the message first to create the conversation,
    // then get it and connect faye
    return promise.then(sendFn).then(handleConnectNotification).then(connectFayeConversation);
}

function sendMessage(text) {
    return sendChain(function () {
        var message = {
            role: 'appUser',
            text: text,
            _clientId: Math.random(),
            _clientSent: new Date(),
            deviceId: (0, _device.getDeviceId)()
        };

        _appStore.store.dispatch((0, _conversationActions.addMessage)(message));

        var _store$getState2 = _appStore.store.getState();

        var user = _store$getState2.user;


        return (0, _core.core)().conversations.sendMessage((0, _userService.getUserId)(), message).then(function (response) {
            if (!user.conversationStarted) {
                // use setConversation to set the conversation id in the store
                _appStore.store.dispatch((0, _conversationActions.setConversation)(response.conversation));
                _appStore.store.dispatch((0, _userActions.updateUser)({
                    conversationStarted: true
                }));
            } else {
                _appStore.store.dispatch((0, _conversationActions.replaceMessage)({
                    _clientId: message._clientId
                }, response.message));
            }

            _events.observable.trigger('message:sent', response.message);
            return response;
        });
    });
}

function uploadImage(file) {
    if (!(0, _media.isFileTypeSupported)(file.type)) {
        _appStore.store.dispatch((0, _appStateActions.showErrorNotification)(_appStore.store.getState().ui.text.invalidFileError));
        return _promise2.default.reject('Invalid file type');
    }

    return (0, _media.resizeImage)(file).then(function (dataUrl) {
        return sendChain(function () {
            var message = {
                mediaUrl: dataUrl,
                mediaType: 'image/jpeg',
                role: 'appUser',
                status: 'sending',
                _clientId: Math.random(),
                _clientSent: new Date()
            };

            _appStore.store.dispatch((0, _conversationActions.addMessage)(message));

            var _store$getState3 = _appStore.store.getState();

            var user = _store$getState3.user;

            var blob = (0, _media.getBlobFromDataUrl)(dataUrl);

            return (0, _core.core)().conversations.uploadImage((0, _userService.getUserId)(), blob, {
                role: 'appUser',
                deviceId: (0, _device.getDeviceId)()
            }).then(function (response) {
                if (!user.conversationStarted) {
                    // use setConversation to set the conversation id in the store
                    _appStore.store.dispatch((0, _conversationActions.setConversation)(response.conversation));
                    _appStore.store.dispatch((0, _userActions.updateUser)({
                        conversationStarted: true
                    }));
                } else {
                    _appStore.store.dispatch((0, _conversationActions.replaceMessage)({
                        _clientId: message._clientId
                    }, response.message));
                }

                _events.observable.trigger('message:sent', response.message);
                return response;
            }).catch(function () {
                _appStore.store.dispatch((0, _appStateActions.showErrorNotification)(_appStore.store.getState().ui.text.messageError));
                _appStore.store.dispatch((0, _conversationActions.removeMessage)({
                    _clientId: message._clientId
                }));
            });
        });
    }).catch(function () {
        _appStore.store.dispatch((0, _appStateActions.showErrorNotification)(_appStore.store.getState().ui.text.invalidFileError));
    });
}

function getConversation() {
    return (0, _core.core)().conversations.get((0, _userService.getUserId)()).then(function (response) {
        _appStore.store.dispatch((0, _conversationActions.setConversation)(response.conversation));
        return response;
    });
}

function connectFayeConversation() {
    var _store$getState4 = _appStore.store.getState();

    var conversationSubscription = _store$getState4.faye.conversationSubscription;


    if (!conversationSubscription) {
        return (0, _faye.subscribeConversation)();
    }

    return _promise2.default.resolve();
}

function connectFayeUser() {
    var _store$getState5 = _appStore.store.getState();

    var userSubscription = _store$getState5.faye.userSubscription;


    if (!userSubscription) {
        return (0, _faye.subscribeUser)();
    }

    return _promise2.default.resolve();
}

function disconnectFaye() {
    var _store$getState6 = _appStore.store.getState();

    var _store$getState6$faye = _store$getState6.faye;
    var conversationSubscription = _store$getState6$faye.conversationSubscription;
    var userSubscription = _store$getState6$faye.userSubscription;


    if (conversationSubscription) {
        conversationSubscription.cancel();
    }

    if (userSubscription) {
        userSubscription.cancel();
    }

    (0, _faye.disconnectClient)();
    _appStore.store.dispatch((0, _fayeActions.unsetFayeSubscriptions)());
}

function resetUnreadCount() {
    var _store$getState7 = _appStore.store.getState();

    var conversation = _store$getState7.conversation;

    if (conversation.unreadCount > 0) {
        _appStore.store.dispatch((0, _conversationActions.resetUnreadCount)());
        return (0, _core.core)().conversations.resetUnreadCount((0, _userService.getUserId)()).then(function (response) {
            return response;
        });
    }

    return _promise2.default.resolve();
}

function handleConversationUpdated() {
    var _store$getState8 = _appStore.store.getState();

    var conversationSubscription = _store$getState8.faye.conversationSubscription;


    if (!conversationSubscription) {
        return getConversation().then(function (response) {
            return connectFayeConversation().then(function () {
                return response;
            });
        });
    }

    return _promise2.default.resolve();
}

function postPostback(actionId) {
    return (0, _core.core)().conversations.postPostback((0, _userService.getUserId)(), actionId).catch(function () {
        _appStore.store.dispatch((0, _appStateActions.showErrorNotification)(_appStore.store.getState().ui.text.actionPostbackError));
    });
}