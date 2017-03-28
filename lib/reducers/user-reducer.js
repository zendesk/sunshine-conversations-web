'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.UserReducer = UserReducer;

var _userActions = require('../actions/user-actions');

var _commonActions = require('../actions/common-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {};

function UserReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
            return (0, _assign2.default)({}, INITIAL_STATE);
        case _userActions.SET_USER:
            return (0, _assign2.default)({}, action.user);
        case _userActions.UPDATE_USER:
            return (0, _assign2.default)({}, state, action.properties);
        case _userActions.RESET_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
}