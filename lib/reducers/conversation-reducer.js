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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
    messages: [],
    unreadCount: 0,
    hasMoreMessages: false,
    isFetchingMoreMessagesFromServer: false
};

var sortMessages = function sortMessages(messages) {
    return messages.sort(function (messageA, messageB) {
        // received is undefined when it's the temp message from the user
        if (!messageA.received && !messageB.received) {
            // `_clientSent` is a local only prop
            return messageA._clientSent - messageB._clientSent;
        }

        if (!messageA.received) {
            return 1;
        }

        if (!messageB.received) {
            return -1;
        }

        return messageA.received - messageB.received;
    });
};

var addMessage = function addMessage(messages, message) {
    var messagesLength = messages.length;
    if (messagesLength > 0) {
        var previousMessage = messages[messagesLength - 1];
        var messageAuthor = message.role === 'appUser' ? message.role : message.name;
        var previousMessageAuthor = previousMessage.role === 'appUser' ? previousMessage.role : previousMessage.name;
        if (messageAuthor !== previousMessageAuthor) {
            message.firstInGroup = true;
            message.lastInGroup = true;
        } else {
            message.lastInGroup = true;
            previousMessage.lastInGroup = false;
            messages[messagesLength - 1] = previousMessage;
        }
    } else {
        message.firstInGroup = true;
        message.lastInGroup = true;
    }
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

var removeDuplicates = function removeDuplicates(messages) {
    var messagesNoDuplicates = [];
    var messagesHash = {};

    messages.forEach(function (message) {
        var key = message._id + message.role + message.mediaType;
        if (!(key in messagesHash)) {
            messagesHash[key] = message;
            messagesNoDuplicates.push(message);
        }
    });

    return messagesNoDuplicates;
};

var assignGroups = function assignGroups(messages) {
    var lastAuthor = void 0;
    messages.forEach(function (message, index) {
        var author = message.role === 'appUser' ? message.role : message.name;

        if (!lastAuthor) {
            lastAuthor = author;
            message.firstInGroup = true;
            message.lastInGroup = true;
        }

        if (lastAuthor === author) {
            if (index > 0) {
                messages[index - 1].lastInGroup = false;
                message.lastInGroup = true;
            }
        } else {
            message.firstInGroup = true;
            message.lastInGroup = true;
        }

        lastAuthor = author;
    });
    return messages;
};

function ConversationReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
        case ConversationActions.RESET_CONVERSATION:
            return (0, _extends3.default)({}, INITIAL_STATE);
        case ConversationActions.SET_CONVERSATION:
            return (0, _extends3.default)({}, action.conversation, {
                messages: state.messages
            });
        case ConversationActions.SET_MESSAGES:
            return (0, _extends3.default)({}, state, {
                messages: assignGroups(sortMessages(removeDuplicates(action.messages)))
            });
        case ConversationActions.ADD_MESSAGES:
            return (0, _extends3.default)({}, state, {
                messages: assignGroups(sortMessages(removeDuplicates(action.append ? [].concat(state.messages, action.messages) : [].concat(action.messages, state.messages))))
            });
        case ConversationActions.ADD_MESSAGE:
            return (0, _assign2.default)({}, state, {
                messages: addMessage(state.messages, action.message)
            });
        case ConversationActions.REPLACE_MESSAGE:
            return (0, _assign2.default)({}, state, {
                messages: sortMessages(replaceMessage(state.messages, action.queryProps, action.message))
            });
        case ConversationActions.REMOVE_MESSAGE:
            return (0, _assign2.default)({}, state, {
                messages: [].concat(state.messages.filter(function (message) {
                    return !matchMessage(message, action.queryProps);
                }))
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