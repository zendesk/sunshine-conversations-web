'use strict';

exports.__esModule = true;
exports.SET_FETCHING_MORE_MESSAGES_FROM_SERVER = exports.INCREMENT_UNREAD_COUNT = exports.RESET_UNREAD_COUNT = exports.SET_MESSAGES = exports.SET_CONVERSATION = exports.RESET_CONVERSATION = exports.REMOVE_MESSAGE = exports.REPLACE_MESSAGE = exports.ADD_MESSAGES = exports.ADD_MESSAGE = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.resetConversation = resetConversation;
exports.setConversation = setConversation;
exports.setMessages = setMessages;
exports.addMessage = addMessage;
exports.addMessages = addMessages;
exports.replaceMessage = replaceMessage;
exports.removeMessage = removeMessage;
exports.incrementUnreadCount = incrementUnreadCount;
exports.resetUnreadCount = resetUnreadCount;
exports.setFetchingMoreMessagesFromServer = setFetchingMoreMessagesFromServer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ADD_MESSAGE = exports.ADD_MESSAGE = 'ADD_MESSAGE';
var ADD_MESSAGES = exports.ADD_MESSAGES = 'ADD_MESSAGES';
var REPLACE_MESSAGE = exports.REPLACE_MESSAGE = 'REPLACE_MESSAGE';
var REMOVE_MESSAGE = exports.REMOVE_MESSAGE = 'REMOVE_MESSAGE';
var RESET_CONVERSATION = exports.RESET_CONVERSATION = 'RESET_CONVERSATION';
var SET_CONVERSATION = exports.SET_CONVERSATION = 'SET_CONVERSATION';
var SET_MESSAGES = exports.SET_MESSAGES = 'SET_MESSAGES';
var RESET_UNREAD_COUNT = exports.RESET_UNREAD_COUNT = 'RESET_UNREAD_COUNT';
var INCREMENT_UNREAD_COUNT = exports.INCREMENT_UNREAD_COUNT = 'INCREMENT_UNREAD_COUNT';
var SET_FETCHING_MORE_MESSAGES_FROM_SERVER = exports.SET_FETCHING_MORE_MESSAGES_FROM_SERVER = 'SET_FETCHING_MORE_MESSAGES_FROM_SERVER';

function resetConversation() {
    return {
        type: RESET_CONVERSATION
    };
}

function setConversation(props) {
    return {
        type: SET_CONVERSATION,
        conversation: props
    };
}

function setMessages(messages) {
    return {
        type: SET_MESSAGES,
        messages: messages
    };
}

function addMessage(props) {
    return {
        type: ADD_MESSAGE,
        message: (0, _extends3.default)({}, props)
    };
}

function addMessages(messages) {
    var append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return {
        type: ADD_MESSAGES,
        messages: messages,
        append: append
    };
}

function replaceMessage(queryProps, message) {
    return {
        type: REPLACE_MESSAGE,
        queryProps: queryProps,
        message: message
    };
}

function removeMessage(queryProps) {
    return {
        type: REMOVE_MESSAGE,
        queryProps: queryProps
    };
}

function incrementUnreadCount() {
    return {
        type: INCREMENT_UNREAD_COUNT
    };
}

function resetUnreadCount() {
    return {
        type: RESET_UNREAD_COUNT
    };
}

function setFetchingMoreMessagesFromServer(value) {
    return {
        type: SET_FETCHING_MORE_MESSAGES_FROM_SERVER,
        value: value
    };
}