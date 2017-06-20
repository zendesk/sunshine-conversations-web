'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.sendMessage = sendMessage;
exports.resendMessage = resendMessage;
exports.sendLocation = sendLocation;
exports.uploadImage = uploadImage;
exports.getMessages = getMessages;
exports.connectFayeConversation = connectFayeConversation;
exports.connectFayeUser = connectFayeUser;
exports.disconnectFaye = disconnectFaye;
exports.resetUnreadCount = resetUnreadCount;
exports.handleConversationUpdated = handleConversationUpdated;
exports.postPostback = postPostback;
exports.fetchMoreMessages = fetchMoreMessages;
exports.handleConnectNotification = handleConnectNotification;
exports.sendChain = sendChain;

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

var _throttle = require('../utils/throttle');

var _media = require('../utils/media');

var _device = require('../utils/device');

var _user2 = require('../utils/user');

var _dom = require('../utils/dom');

var _notifications = require('../constants/notifications');

var _message = require('../constants/message');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Throttle requests per appUser
var throttleMap = {};
var throttlePerUser = function throttlePerUser(userId) {
    if (!throttleMap[userId]) {
        throttleMap[userId] = new _throttle.Throttle();
    }

    return throttleMap[userId];
};

var postSendMessage = function postSendMessage(message) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.sendMessage((0, _user.getUserId)(getState()), message);
    };
};

var postUploadImage = function postUploadImage(message) {
    return function (dispatch, getState) {
        var blob = (0, _media.getBlobFromDataUrl)(message.mediaUrl);

        return (0, _core.core)(getState()).appUsers.uploadImage((0, _user.getUserId)(getState()), blob, {
            role: 'appUser',
            deviceId: (0, _device.getDeviceId)()
        });
    };
};

var onMessageSendSuccess = function onMessageSendSuccess(message, response) {
    return function (dispatch, getState) {
        var actions = [];

        var _getState = getState(),
            user = _getState.user;

        if (!user.conversationStarted) {
            // use setConversation to set the conversation id in the store
            actions.push((0, _conversationActions.setConversation)(response.conversation));
            actions.push((0, _userActions.updateUser)({
                conversationStarted: true
            }));
        }

        actions.push((0, _appStateActions.setShouldScrollToBottom)(true));
        actions.push((0, _conversationActions.replaceMessage)({
            _clientId: message._clientId
        }, response.message));

        dispatch((0, _reduxBatchedActions.batchActions)(actions));
        _events.observable.trigger('message:sent', response.message);

        return response;
    };
};

var onMessageSendFailure = function onMessageSendFailure(message) {
    return function (dispatch) {
        var actions = [];
        message.sendStatus = _message.SEND_STATUS.FAILED;

        actions.push((0, _appStateActions.setShouldScrollToBottom)(true));
        actions.push((0, _conversationActions.replaceMessage)({
            _clientId: message._clientId
        }, message));

        dispatch((0, _reduxBatchedActions.batchActions)(actions));
    };
};

var addMessage = function addMessage(props) {
    return function (dispatch, getState) {
        if (props._clientId) {
            var oldMessage = getState().conversation.messages.find(function (message) {
                return message._clientId === props._clientId;
            });
            var newMessage = (0, _assign2.default)({}, oldMessage, props);

            dispatch((0, _conversationActions.replaceMessage)({
                _clientId: props._clientId
            }, newMessage));

            return newMessage;
        }

        var message = {
            type: 'text',
            role: 'appUser',
            _clientId: Math.random(),
            _clientSent: Date.now() / 1000,
            deviceId: (0, _device.getDeviceId)(),
            sendStatus: _message.SEND_STATUS.SENDING
        };

        if (typeof props === 'string') {
            message.text = props;
        } else {
            (0, _assign2.default)(message, props);
        }

        dispatch((0, _reduxBatchedActions.batchActions)([(0, _appStateActions.setShouldScrollToBottom)(true), (0, _conversationActions.addMessage)(message)]));

        return message;
    };
};

var removeMessage = function removeMessage(messageClientId) {
    return function (dispatch) {
        dispatch((0, _reduxBatchedActions.batchActions)([(0, _appStateActions.setShouldScrollToBottom)(true), (0, _conversationActions.removeMessage)({
            _clientId: messageClientId
        })]));
    };
};

function sendMessage(props) {
    return function (dispatch) {
        var message = dispatch(addMessage(props));
        return dispatch(sendChain(postSendMessage, message));
    };
}

function resendMessage(messageClientId) {
    return function (dispatch, getState) {
        var oldMessage = getState().conversation.messages.find(function (message) {
            return message._clientId === messageClientId;
        });

        if (!oldMessage) {
            return;
        }

        var newMessage = (0, _assign2.default)({}, oldMessage, {
            sendStatus: _message.SEND_STATUS.SENDING
        });

        dispatch((0, _conversationActions.replaceMessage)({
            _clientId: messageClientId
        }, newMessage));

        if (newMessage.type === 'text') {
            return dispatch(sendChain(postSendMessage, newMessage));
        } else if (newMessage.type === 'location') {
            if (newMessage.coordinates) {
                return dispatch(sendChain(postSendMessage, newMessage));
            } else {
                return dispatch(sendLocation(newMessage));
            }
        }

        return dispatch(sendChain(postUploadImage, newMessage));
    };
}

function sendLocation() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return function (dispatch, getState) {
        var message = void 0;

        if (props._clientSent) {
            message = props;
        } else {
            message = dispatch(addMessage((0, _extends3.default)({
                type: 'location'
            }, props)));
        }

        if (message.coordinates) {
            return dispatch(sendChain(postSendMessage, message));
        }

        var locationServicesDeniedText = getState().ui.text.locationServicesDenied;
        var locationSecurityRestrictionText = getState().ui.text.locationSecurityRestriction;

        return new _promise2.default(function (resolve) {
            var timedOut = false;

            var timeout = setTimeout(function () {
                timedOut = true;
                dispatch(onMessageSendFailure(message));
                resolve();
            }, 10000);

            navigator.geolocation.getCurrentPosition(function (position) {
                clearTimeout(timeout);
                if (timedOut) {
                    return;
                }

                (0, _assign2.default)(message, {
                    coordinates: {
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    }
                });

                dispatch((0, _conversationActions.replaceMessage)({
                    _clientId: message._clientId
                }, message));

                dispatch(sendChain(postSendMessage, message)).then(resolve);
            }, function (err) {
                clearTimeout(timeout);
                if (timedOut) {
                    return;
                }
                if ((0, _dom.getWindowLocation)().protocol !== 'https:') {
                    setTimeout(function () {
                        return alert(locationSecurityRestrictionText);
                    }, 100);
                    dispatch(removeMessage(message._clientId));
                } else if (err.code === _message.LOCATION_ERRORS.PERMISSION_DENIED) {
                    setTimeout(function () {
                        return alert(locationServicesDeniedText);
                    }, 100);
                    dispatch(removeMessage(message._clientId));
                } else {
                    dispatch(onMessageSendFailure(message));
                }
                resolve();
            });
        });
    };
}

function uploadImage(file) {
    return function (dispatch, getState) {
        if (!(0, _media.isFileTypeSupported)(file.type)) {
            return _promise2.default.resolve(dispatch((0, _appStateActions.showErrorNotification)(getState().ui.text.invalidFileError)));
        }

        return (0, _media.resizeImage)(file).then(function (dataUrl) {
            var message = dispatch(addMessage({
                mediaUrl: dataUrl,
                mediaType: 'image/jpeg',
                type: 'image'
            }));
            return dispatch(sendChain(postUploadImage, message));
        }).catch(function () {
            dispatch((0, _appStateActions.showErrorNotification)(getState().ui.text.invalidFileError));
        });
    };
}

function _getMessages(dispatch, getState) {
    var userId = (0, _user.getUserId)(getState());
    return (0, _core.core)(getState()).appUsers.getMessages(userId).then(function (response) {
        dispatch((0, _reduxBatchedActions.batchActions)([(0, _conversationActions.setConversation)((0, _extends3.default)({}, response.conversation, {
            hasMoreMessages: !!response.previous
        })), (0, _conversationActions.setMessages)(response.messages)]));
        return response;
    });
}

function getMessages() {
    return function (dispatch, getState) {
        var userId = (0, _user.getUserId)(getState());
        return throttlePerUser(userId).exec(function () {
            return _getMessages(dispatch, getState);
        });
    };
}

function connectFayeConversation() {
    return function (dispatch, getState) {
        var _getState2 = getState(),
            conversationSubscription = _getState2.faye.conversationSubscription;

        if (!conversationSubscription) {
            return _promise2.default.all([dispatch((0, _faye.subscribeConversation)()), dispatch((0, _faye.subscribeConversationActivity)())]);
        }

        return _promise2.default.resolve();
    };
}

function connectFayeUser() {
    return function (dispatch, getState) {
        var _getState3 = getState(),
            userSubscription = _getState3.faye.userSubscription;

        if (!userSubscription) {
            return dispatch((0, _faye.subscribeUser)());
        }

        return _promise2.default.resolve();
    };
}

function disconnectFaye() {
    return function (dispatch, getState) {
        var _getState4 = getState(),
            _getState4$faye = _getState4.faye,
            conversationSubscription = _getState4$faye.conversationSubscription,
            userSubscription = _getState4$faye.userSubscription;

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
        var _getState5 = getState(),
            conversation = _getState5.conversation;

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
        var _getState6 = getState(),
            conversationSubscription = _getState6.faye.conversationSubscription;

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
        var _getState7 = getState(),
            _getState7$conversati = _getState7.conversation,
            hasMoreMessages = _getState7$conversati.hasMoreMessages,
            messages = _getState7$conversati.messages,
            isFetchingMoreMessagesFromServer = _getState7$conversati.isFetchingMoreMessagesFromServer;

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

function handleConnectNotification(response) {
    return function (dispatch, getState) {
        var _getState8 = getState(),
            _getState8$user = _getState8.user,
            clients = _getState8$user.clients,
            email = _getState8$user.email,
            _getState8$app = _getState8.app,
            integrations = _getState8$app.integrations,
            settings = _getState8$app.settings,
            messages = _getState8.conversation.messages,
            emailCaptureEnabled = _getState8.appState.emailCaptureEnabled;

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

function sendChain(sendFn, message) {
    return function (dispatch, getState) {
        var promise = dispatch((0, _user.immediateUpdate)(getState().user));

        var postSendHandler = function postSendHandler(response) {
            return _promise2.default.resolve(dispatch(onMessageSendSuccess(message, response))).then(function () {
                return dispatch(handleConnectNotification(response));
            }).then(function () {
                return dispatch(connectFayeConversation());
            }).catch(); // swallow errors to avoid uncaught promises bubbling up
        };

        return promise.then(function () {
            return dispatch(sendFn(message)).then(postSendHandler).catch(function () {
                return dispatch(onMessageSendFailure(message));
            });
        });
    };
}