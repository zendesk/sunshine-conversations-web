'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.handleFirstUserMessage = handleFirstUserMessage;
exports.sendChain = sendChain;
exports.sendMessage = sendMessage;
exports.uploadImage = uploadImage;
exports.getConversation = getConversation;
exports.connectFaye = connectFaye;
exports.disconnectFaye = disconnectFaye;
exports.resetUnreadCount = resetUnreadCount;
exports.handleConversationUpdated = handleConversationUpdated;
exports.postPostback = postPostback;

var _appStore = require('../stores/app-store');

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleFirstUserMessage(response) {
    var state = _appStore.store.getState();
    if (state.appState.settingsEnabled && !state.user.email) {
        var appUserMessageCount = state.conversation.messages.filter(function (message) {
            return message.role === 'appUser';
        }).length;

        if (appUserMessageCount === 1) {
            // should only be one message from the app user
            _appStore.store.dispatch((0, _appStateActions.showSettingsNotification)());
        }
    }

    return response;
}

function sendChain(sendFn) {
    var promise = (0, _userService.immediateUpdate)(_appStore.store.getState().user);

    if (_appStore.store.getState().user.conversationStarted) {
        return promise.then(connectFaye).then(sendFn).then(handleFirstUserMessage);
    }

    // if it's not started, send the message first to create the conversation,
    // then get it and connect faye
    return promise.then(sendFn).then(handleFirstUserMessage).then(connectFaye);
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

        var user = _appStore.store.getState().user;

        return (0, _core.core)().conversations.sendMessage(user._id, message).then(function (response) {
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

            var user = _appStore.store.getState().user;
            var blob = (0, _media.getBlobFromDataUrl)(dataUrl);

            return (0, _core.core)().conversations.uploadImage(user._id, blob, {
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
    var user = _appStore.store.getState().user;
    return (0, _core.core)().conversations.get(user._id).then(function (response) {
        _appStore.store.dispatch((0, _conversationActions.setConversation)(response.conversation));
        return response;
    });
}

function connectFaye() {
    var subscription = _appStore.store.getState().faye.subscription;
    if (!subscription) {
        subscription = (0, _faye.initFaye)();
        _appStore.store.dispatch((0, _fayeActions.setFayeSubscription)(subscription));
    }

    return subscription;
}

function disconnectFaye() {
    var subscription = _appStore.store.getState().faye.subscription;
    if (subscription) {
        subscription.cancel();
        _appStore.store.dispatch((0, _fayeActions.unsetFayeSubscription)());
    }
}

function resetUnreadCount() {
    var _store$getState = _appStore.store.getState();

    var user = _store$getState.user;
    var conversation = _store$getState.conversation;

    if (conversation.unreadCount > 0) {
        _appStore.store.dispatch((0, _conversationActions.resetUnreadCount)());
        return (0, _core.core)().conversations.resetUnreadCount(user._id).then(function (response) {
            return response;
        });
    }

    return _promise2.default.resolve();
}

function handleConversationUpdated() {
    var subscription = _appStore.store.getState().faye.subscription;

    if (!subscription) {
        return getConversation().then(function (response) {
            return connectFaye().then(function () {
                return response;
            });
        });
    }

    return _promise2.default.resolve();
}

function postPostback(actionId) {
    var _store$getState2 = _appStore.store.getState();

    var user = _store$getState2.user;

    return (0, _core.core)().conversations.postPostback(user._id, actionId).catch(function () {
        _appStore.store.dispatch((0, _appStateActions.showErrorNotification)(_appStore.store.getState().ui.text.actionPostbackError));
    });
}