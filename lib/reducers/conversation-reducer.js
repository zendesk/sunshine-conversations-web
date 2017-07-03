'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.ConversationReducer = ConversationReducer;

var _conversationActions = require('../actions/conversation-actions');

var ConversationActions = _interopRequireWildcard(_conversationActions);

var _commonActions = require('../actions/common-actions');

var _message = require('../constants/message');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
    messages: [],
    replyActions: [],
    unreadCount: 0,
    hasMoreMessages: false,
    isFetchingMoreMessagesFromServer: false
};

var sortMessages = function sortMessages(messages) {
    return messages.sort(function (messageA, messageB) {
        var messageADate = messageA.received || messageA._clientSent;
        var messageBDate = messageB.received || messageB._clientSent;

        return messageADate - messageBDate;
    });
};

var manageGroupsBetweenMessages = function manageGroupsBetweenMessages(messages, previousMessageIndex, message) {
    var previousMessage = previousMessageIndex >= 0 && messages[previousMessageIndex];
    if (previousMessage) {
        var messageAuthor = message.role === 'appUser' ? message.role : message.name;
        var previousMessageAuthor = previousMessage.role === 'appUser' ? previousMessage.role : previousMessage.name;

        if (previousMessage.role !== message.role) {
            previousMessage.lastInGroup = true;
            message.firstInGroup = true;
            message.lastInGroup = true;
        } else {
            if (messageAuthor !== previousMessageAuthor) {
                message.firstInGroup = true;
                message.lastInGroup = true;
            } else {
                message.lastInGroup = true;
                previousMessage.lastInGroup = false;
            }
        }

        messages[previousMessageIndex] = previousMessage;
    } else {
        message.firstInGroup = true;
        message.lastInGroup = true;
    }
};

var extractReplyActions = function extractReplyActions() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$actions = _ref.actions,
        actions = _ref$actions === undefined ? [] : _ref$actions;

    return actions.filter(function (_ref2) {
        var type = _ref2.type;
        return type === 'reply' || type === 'locationRequest';
    });
};

var addMessage = function addMessage(messages, message) {
    var replyActions = extractReplyActions(message);

    var hasText = message.text && message.text.trim() || message.mediaUrl && message.mediaUrl.trim();
    if (replyActions.length > 0 && !hasText) {
        // if the message contains reply actions and has no text,
        // don't add it to the messages
        return messages;
    }

    var messagesLength = messages.length;
    manageGroupsBetweenMessages(messages, messagesLength - 1, message);
    return sortMessages([].concat(messages, [message]));
};

var matchMessage = function matchMessage(message, queryProps) {
    return (0, _keys2.default)(queryProps).every(function (key) {
        return message[key] === queryProps[key];
    });
};

var replaceMessage = function replaceMessage(messages, query, newMessage) {
    var existingMessage = messages.find(function (message) {
        return matchMessage(message, query);
    });

    if (!existingMessage) {
        return messages;
    }

    if (existingMessage._clientId) {
        newMessage = (0, _extends3.default)({}, newMessage, {
            _clientId: existingMessage._clientId,
            lastInGroup: existingMessage.lastInGroup,
            firstInGroup: existingMessage.firstInGroup
        });
    }

    var index = messages.indexOf(existingMessage);
    return [].concat(messages.slice(0, index), [newMessage], messages.slice(index + 1));
};

var preserveFailedMessages = function preserveFailedMessages(messages) {
    return messages.filter(function (message) {
        return message.status = _message.SEND_STATUS.FAILED;
    });
};

var cleanUpMessages = function cleanUpMessages(messages) {
    var cleanedMessages = [];
    var messagesHash = {};

    // removes duplicate messages and empty messages
    messages.forEach(function (message) {
        var messageText = message.text && !!message.text.trim() || message.mediaUrl && !!message.mediaUrl.trim();

        var key = message._id ? message._id + message.role + message.mediaType : message._clientSent + message.role + message.mediaType;

        // if there is no messageId, message is not yet sent
        if (!message._id) {
            key = message._clientSent;
        }

        var hasContent = messageText || message.actions && message.actions.filter(function (_ref3) {
            var type = _ref3.type;
            return !_message.GLOBAL_ACTION_TYPES.includes(type);
        }).length > 0;

        if (!(key in messagesHash) && hasContent) {
            messagesHash[key] = message;
            cleanedMessages.push(message);
        }
    });

    return cleanedMessages;
};

var assignGroups = function assignGroups(messages) {
    messages.forEach(function (message, index) {
        manageGroupsBetweenMessages(messages, index - 1, message);
    });
    return messages;
};

function ConversationReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
        case ConversationActions.RESET_CONVERSATION:
            return (0, _extends3.default)({}, INITIAL_STATE);
        case ConversationActions.SET_CONVERSATION:
            return (0, _extends3.default)({}, action.conversation, {
                messages: state.messages,
                replyActions: state.replyActions
            });
        case ConversationActions.SET_MESSAGES:
            return (0, _extends3.default)({}, state, {
                messages: assignGroups(sortMessages(cleanUpMessages([].concat(action.messages, preserveFailedMessages(state.messages))))),
                replyActions: extractReplyActions(action.messages[action.messages.length - 1])
            });
        case ConversationActions.ADD_MESSAGES:
            return (0, _extends3.default)({}, state, {
                messages: assignGroups(sortMessages(cleanUpMessages(action.append ? [].concat(state.messages, action.messages) : [].concat(action.messages, state.messages)))),
                replyActions: extractReplyActions(action.messages[action.messages.length - 1])
            });
        case ConversationActions.ADD_MESSAGE:
            return (0, _assign2.default)({}, state, {
                messages: addMessage(state.messages, action.message),
                replyActions: extractReplyActions(action.message)
            });
        case ConversationActions.REPLACE_MESSAGE:
            return (0, _assign2.default)({}, state, {
                messages: assignGroups(sortMessages(replaceMessage(state.messages, action.queryProps, action.message)))
            });
        case ConversationActions.REMOVE_MESSAGE:
            return (0, _assign2.default)({}, state, {
                messages: [].concat(state.messages.filter(function (message) {
                    return !matchMessage(message, action.queryProps);
                })),
                replyActions: state.messages[state.messages.length - 2] && extractReplyActions(state.messages[state.messages.length - 2])
            });
        case ConversationActions.INCREMENT_UNREAD_COUNT:
            return (0, _assign2.default)({}, state, {
                unreadCount: state.unreadCount + 1
            });
        case ConversationActions.RESET_UNREAD_COUNT:
            return (0, _assign2.default)({}, state, {
                unreadCount: 0
            });
        case ConversationActions.SET_FETCHING_MORE_MESSAGES_FROM_SERVER:
            return (0, _assign2.default)({}, state, {
                isFetchingMoreMessagesFromServer: action.value
            });
        default:
            return state;
    }
}