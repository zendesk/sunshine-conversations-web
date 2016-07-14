'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.AppReducer = AppReducer;

var _appActions = require('../actions/app-actions');

var _commonActions = require('../actions/common-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
    integrations: [],
    settings: {
        web: {
            channels: {}
        }
    }
};

function filterIntegrations(integrations, channelSettings) {
    // check for !== false because we also want it to be true if the key is not in channelSettings
    return integrations.filter(function (_ref) {
        var platform = _ref.platform;
        return channelSettings[platform] !== false;
    });
}

function AppReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
        case _appActions.RESET_APP:
            return (0, _extends3.default)({}, INITIAL_STATE);

        case _appActions.SET_APP:
            return (0, _extends3.default)({}, action.app, {
                integrations: filterIntegrations(action.app.integrations, action.app.settings.web)
            });

        case _appActions.SET_STRIPE_INFO:
            return (0, _extends3.default)({}, state, {
                stripe: action.props
            });

        default:
            return state;
    }
}