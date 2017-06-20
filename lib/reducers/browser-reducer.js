'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.BrowserReducer = BrowserReducer;

var _browserActions = require('../actions/browser-actions');

var _commonActions = require('../actions/common-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
    hasFocus: false,
    currentLocation: document.location
};

function BrowserReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
            return (0, _assign2.default)({}, INITIAL_STATE);
        case _browserActions.SET_HAS_FOCUS:
            return (0, _extends3.default)({}, state, {
                hasFocus: action.hasFocus
            });
        case _browserActions.SET_CURRENT_LOCATION:
            return (0, _extends3.default)({}, state, {
                currentLocation: (0, _extends3.default)({}, action.location)
            });
        default:
            return state;
    }
}