'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.IntegrationsReducer = IntegrationsReducer;

var _appActions = require('../actions/app-actions');

var _commonActions = require('../actions/common-actions');

var _integrationsActions = require('../actions/integrations-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
    wechat: {
        hasError: false,
        qrCode: ''
    }
};

function IntegrationsReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
        case _appActions.RESET_APP:
        case _integrationsActions.RESET_INTEGRATIONS:
            return (0, _extends3.default)({}, INITIAL_STATE);
        case _integrationsActions.SET_WECHAT_QR_CODE:
            return (0, _extends3.default)({}, state, {
                wechat: (0, _extends3.default)({}, state.wechat, {
                    qrCode: action.code
                })
            });
        case _integrationsActions.SET_WECHAT_ERROR:
            return (0, _extends3.default)({}, state, {
                wechat: (0, _extends3.default)({}, state.wechat, {
                    hasError: true
                })
            });
        case _integrationsActions.UNSET_WECHAT_ERROR:
            return (0, _extends3.default)({}, state, {
                wechat: (0, _extends3.default)({}, state.wechat, {
                    hasError: false
                })
            });
        default:
            return state;
    }
}