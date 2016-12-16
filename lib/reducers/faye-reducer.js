'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.FayeReducer = FayeReducer;

var _fayeActions = require('../actions/faye-actions');

var _commonActions = require('../actions/common-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {};

function FayeReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
            return (0, _assign2.default)({}, INITIAL_STATE);
        case _fayeActions.SET_FAYE_CONVERSATION_SUBSCRIPTION:
            return (0, _assign2.default)({}, state, {
                conversationSubscription: action.subscription
            });
        case _fayeActions.SET_FAYE_USER_SUBSCRIPTION:
            return (0, _assign2.default)({}, state, {
                userSubscription: action.subscription
            });
        case _fayeActions.UNSET_FAYE_SUBSCRIPTIONS:
            return (0, _assign2.default)({}, state, {
                conversationSubscription: undefined,
                userSubscription: undefined
            });
        default:
            return state;
    }
}