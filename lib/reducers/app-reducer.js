'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.AppReducer = AppReducer;

var _appActions = require('../actions/app-actions');

var _commonActions = require('../actions/common-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
    settings: {
        web: {}
    },
    publicKeys: {},
    stripe: {}
};

function AppReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
        case _appActions.RESET_APP:
            return (0, _assign2.default)({}, INITIAL_STATE);
        case _appActions.SET_PUBLIC_KEYS:
            return (0, _assign2.default)({}, state, {
                publicKeys: action.keys
            });
        case _appActions.SET_STRIPE_INFO:
            return (0, _assign2.default)({}, state, {
                stripe: action.props
            });
        case _appActions.SET_APP_SETTINGS:
            return (0, _assign2.default)({}, state, {
                settings: action.props
            });
        default:
            return state;
    }
}