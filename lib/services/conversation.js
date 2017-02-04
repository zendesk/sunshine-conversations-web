'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.handleConnectNotification = handleConnectNotification;
exports.sendChain = sendChain;
exports.sendMessage = sendMessage;
exports.uploadImage = uploadImage;
exports.getMessages = getMessages;
exports.connectFayeConversation = connectFayeConversation;
exports.connectFayeUser = connectFayeUser;
exports.disconnectFaye = disconnectFaye;
exports.resetUnreadCount = resetUnreadCount;
exports.handleConversationUpdated = handleConversationUpdated;
exports.postPostback = postPostback;
exports.fetchMoreMessages = fetchMoreMessages;

var _reduxBatchedActions = require('redux-batched-actions');

var _app = require('../services/app');

var _conversationActions = require('../actions/conversation-actions');

var _userActions = require('../actions/user-actions');

var _appStateActions = require('../actions/app-state-actions');

var _fayeActions = require('../actions/faye-actions');

var _core = require('./core');

var _user = require('./user');

var _faye = require('./faye');

var _events = require('../utils/events');

var _media = require('../utils/media');

var _device = require('../utils/device');

var _user2 = require('../utils/user');

var _notifications = require('../constants/notifications');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleConnectNotification(response) {
    return function (dispatch, getState) {
        var _getState = getState(),
            _getState$user = _getState.user,
            clients = _getState$user.clients,
            email = _getState$user.email,
            _getState$app = _getState.app,
            integrations = _getState$app.integrations,
            settings = _getState$app.settings,
            messages = _getState.conversation.messages,
            emailCaptureEnabled = _getState.appState.emailCaptureEnabled;

        var appUserMessages = messages.filter(function (message) {
            return message.role === 'appUser';
        });

        var channelsAvailable = (0, _user2.hasLinkableChannels)(integrations, clients, settings.web);
        var showEmailCapture = emailCaptureEnabled && !email;
        var hasSomeChannelLinked = (0, _user2.getLinkableChannels)(integrations, settings.web).some(function (channelType) {
            return (0, _user2.isChannelLinked)(clients, channelType);
        });

        if ((showEmailCapture || channelsAvailable) && !hasSomeChannelLinked) {
            if (appUserMessages.length === 1) {
                dispatch((0, _app.showConnectNotification)());
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
                        dispatch((0, _app.showConnectNotification)());
                    }
                }
            }
        }

        return response;
    };
}

function sendChain(sendFn) {
    return function (dispatch, getState) {
        var promise = dispatch((0, _user.immediateUpdate)(getState().user));

        var enableScrollToBottom = function enableScrollToBottom(response) {
            dispatch((0, _appStateActions.setShouldScrollToBottom)(true));
            return response;
        };

        if (getState().user.conversationStarted) {
            return promise.then(function () {
                return dispatch(connectFayeConversation());
            }).then(function () {
                return sendFn();
            }).then(enableScrollToBottom).then(function (response) {
                return dispatch(handleConnectNotification(response));
            });
        }

        // if it's not started, send the message first to create the conversation,
        // then get it and connect faye
        return promise.then(function () {
            return sendFn();
        }).then(enableScrollToBottom).then(function (response) {
            return dispatch(handleConnectNotification(response));
        }).then(function () {
            return dispatch(connectFayeConversation());
        });
    };
}

function sendMessage(text) {
    var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return function (dispatch, getState) {
        var fn = function fn() {
            var message = (0, _extends3.default)({
                role: 'appUser',
                text: text,
                _clientId: Math.random(),
                _clientSent: new Date(),
                deviceId: (0, _device.getDeviceId)()
            }, extra);

            dispatch((0, _reduxBatchedActions.batchActions)([(0, _appStateActions.setShouldScrollToBottom)(true), (0, _conversationActions.addMessage)(message)]));

            var _getState2 = getState(),
                user = _getState2.user;

            return (0, _core.core)(getState()).appUsers.sendMessage((0, _user.getUserId)(getState()), message).then(function (response) {
                var actions = [];
                if (!user.conversationStarted) {
                    // use setConversation to set the conversation id in the store
                    actions.push((0, _conversationActions.setConversation)(response.conversation));
                    actions.push((0, _userActions.updateUser)({
                        conversationStarted: true
                    }));
                }
                actions.push((0, _conversationActions.replaceMessage)({
                    _clientId: message._clientId
                }, response.message));

                dispatch((0, _reduxBatchedActions.batchActions)(actions));

                _events.observable.trigger('message:sent', response.message);
                return response;
            }).catch(function () {
                dispatch((0, _reduxBatchedActions.batchActions)([(0, _appStateActions.showErrorNotification)(getState().ui.text.messageError), (0, _conversationActions.removeMessage)({
                    _clientId: message._clientId
                })]));
            });
        };

        return dispatch(sendChain(fn));
    };
}

function uploadImage(file) {
    return function (dispatch, getState) {

        if (!(0, _media.isFileTypeSupported)(file.type)) {
            dispatch((0, _appStateActions.showErrorNotification)(getState().ui.text.invalidFileError));
            return _promise2.default.reject('Invalid file type');
        }

        return (0, _media.resizeImage)(file).then(function (dataUrl) {
            var fn = function fn() {
                var message = {
                    mediaUrl: dataUrl,
                    mediaType: 'image/jpeg',
                    role: 'appUser',
                    type: 'image',
                    status: 'sending',
                    _clientId: Math.random(),
                    _clientSent: new Date()
                };

                dispatch((0, _conversationActions.addMessage)(message));

                var _getState3 = getState(),
                    user = _getState3.user;

                var blob = (0, _media.getBlobFromDataUrl)(dataUrl);

                return (0, _core.core)(getState()).appUsers.uploadImage((0, _user.getUserId)(getState()), blob, {
                    role: 'appUser',
                    deviceId: (0, _device.getDeviceId)()
                }).then(function (response) {
                    var actions = [];
                    if (!user.conversationStarted) {
                        // use setConversation to set the conversation id in the store
                        actions.push((0, _conversationActions.setConversation)(response.conversation));
                        actions.push((0, _userActions.updateUser)({
                            conversationStarted: true
                        }));
                    }

                    actions.push((0, _conversationActions.replaceMessage)({
                        _clientId: message._clientId
                    }, response.message));

                    dispatch((0, _reduxBatchedActions.batchActions)(actions));
                    _events.observable.trigger('message:sent', response.message);
                    return response;
                }).catch(function () {
                    dispatch((0, _reduxBatchedActions.batchActions)([(0, _appStateActions.showErrorNotification)(getState().ui.text.messageError), (0, _conversationActions.removeMessage)({
                        _clientId: message._clientId
                    })]));
                });
            };
            return dispatch(sendChain(fn));
        }).catch(function () {
            dispatch((0, _appStateActions.showErrorNotification)(getState().ui.text.invalidFileError));
        });
    };
}

function getMessages() {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.getMessages((0, _user.getUserId)(getState())).then(function (response) {
            dispatch((0, _reduxBatchedActions.batchActions)([(0, _conversationActions.setConversation)((0, _extends3.default)({}, response.conversation, {
                hasMoreMessages: !!response.previous
            })), (0, _conversationActions.setMessages)(response.messages)]));
            return response;
        });
    };
}

function connectFayeConversation() {
    return function (dispatch, getState) {
        var _getState4 = getState(),
            conversationSubscription = _getState4.faye.conversationSubscription;

        if (!conversationSubscription) {
            return _promise2.default.all([dispatch((0, _faye.subscribeConversation)()), dispatch((0, _faye.subscribeConversationActivity)())]);
        }

        return _promise2.default.resolve();
    };
}

function connectFayeUser() {
    return function (dispatch, getState) {
        var _getState5 = getState(),
            userSubscription = _getState5.faye.userSubscription;

        if (!userSubscription) {
            return dispatch((0, _faye.subscribeUser)());
        }

        return _promise2.default.resolve();
    };
}

function disconnectFaye() {
    return function (dispatch, getState) {
        var _getState6 = getState(),
            _getState6$faye = _getState6.faye,
            conversationSubscription = _getState6$faye.conversationSubscription,
            userSubscription = _getState6$faye.userSubscription;

        if (conversationSubscription) {
            conversationSubscription.cancel();
        }

        if (userSubscription) {
            userSubscription.cancel();
        }

        (0, _faye.disconnectClient)();
        dispatch((0, _fayeActions.unsetFayeSubscriptions)());
    };
}

function resetUnreadCount() {
    return function (dispatch, getState) {
        var _getState7 = getState(),
            conversation = _getState7.conversation;

        if (conversation.unreadCount > 0) {
            dispatch((0, _conversationActions.resetUnreadCount)());
            return (0, _core.core)(getState()).conversations.resetUnreadCount((0, _user.getUserId)(getState())).then(function (response) {
                return response;
            });
        }

        return _promise2.default.resolve();
    };
}

function handleConversationUpdated() {
    return function (dispatch, getState) {
        var _getState8 = getState(),
            conversationSubscription = _getState8.faye.conversationSubscription;

        if (!conversationSubscription) {
            return dispatch(getMessages()).then(function (response) {
                return dispatch(connectFayeConversation()).then(function () {
                    return response;
                });
            });
        }

        return _promise2.default.resolve();
    };
}

function postPostback(actionId) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).conversations.postPostback((0, _user.getUserId)(getState()), actionId).catch(function () {
            dispatch((0, _appStateActions.showErrorNotification)(getState().ui.text.actionPostbackError));
        });
    };
}

function fetchMoreMessages() {
    return function (dispatch, getState) {
        var _getState9 = getState(),
            _getState9$conversati = _getState9.conversation,
            hasMoreMessages = _getState9$conversati.hasMoreMessages,
            messages = _getState9$conversati.messages,
            isFetchingMoreMessagesFromServer = _getState9$conversati.isFetchingMoreMessagesFromServer;

        if (!hasMoreMessages || isFetchingMoreMessagesFromServer) {
            return _promise2.default.resolve();
        }

        var timestamp = messages[0].received;
        dispatch((0, _conversationActions.setFetchingMoreMessagesFromServer)(true));
        return (0, _core.core)(getState()).appUsers.getMessages((0, _user.getUserId)(getState()), {
            before: timestamp
        }).then(function (response) {
            dispatch((0, _reduxBatchedActions.batchActions)([(0, _conversationActions.setConversation)((0, _extends3.default)({}, response.conversation, {
                hasMoreMessages: !!response.previous
            })), (0, _conversationActions.addMessages)(response.messages, false), (0, _conversationActions.setFetchingMoreMessagesFromServer)(false), (0, _appStateActions.setFetchingMoreMessages)(false)]));
            return response;
        });
    };
}