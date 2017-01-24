'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.AuthReducer = AuthReducer;

var _authActions = require('../actions/auth-actions');

var _commonActions = require('../actions/common-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {};

function AuthReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
            return (0, _assign2.default)({}, INITIAL_STATE);
        case _authActions.SET_AUTH:
            return (0, _assign2.default)({}, state, action.props);
        case _authActions.RESET_AUTH:
            return INITIAL_STATE;
        default:
            return state;
    }
}