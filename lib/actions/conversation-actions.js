'use strict';

exports.__esModule = true;
exports.INCREMENT_UNREAD_COUNT = exports.RESET_UNREAD_COUNT = exports.SET_CONVERSATION = exports.RESET_CONVERSATION = exports.REMOVE_MESSAGE = exports.REPLACE_MESSAGE = exports.ADD_MESSAGE = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.resetConversation = resetConversation;
exports.setConversation = setConversation;
exports.addMessage = addMessage;
exports.replaceMessage = replaceMessage;
exports.removeMessage = removeMessage;
exports.incrementUnreadCount = incrementUnreadCount;
exports.resetUnreadCount = resetUnreadCount;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ADD_MESSAGE = exports.ADD_MESSAGE = 'ADD_MESSAGE';
var REPLACE_MESSAGE = exports.REPLACE_MESSAGE = 'REPLACE_MESSAGE';
var REMOVE_MESSAGE = exports.REMOVE_MESSAGE = 'REMOVE_MESSAGE';
var RESET_CONVERSATION = exports.RESET_CONVERSATION = 'RESET_CONVERSATION';
var SET_CONVERSATION = exports.SET_CONVERSATION = 'SET_CONVERSATION';
var RESET_UNREAD_COUNT = exports.RESET_UNREAD_COUNT = 'RESET_UNREAD_COUNT';
var INCREMENT_UNREAD_COUNT = exports.INCREMENT_UNREAD_COUNT = 'INCREMENT_UNREAD_COUNT';

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

function addMessage(props) {
    return {
        type: ADD_MESSAGE,
        message: (0, _assign2.default)({
            actions: []
        }, props)
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