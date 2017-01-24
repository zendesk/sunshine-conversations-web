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
    viber: {
        hasError: false,
        qrCode: ''
    },
    wechat: {
        hasError: false,
        qrCode: ''
    },
    twilio: {
        linkState: 'unlinked',
        appUserNumber: '',
        hasError: false
    }
};

function IntegrationsReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
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
        case _integrationsActions.SET_VIBER_QR_CODE:
            return (0, _extends3.default)({}, state, {
                viber: (0, _extends3.default)({}, state.viber, {
                    qrCode: action.code
                })
            });
        case _integrationsActions.SET_VIBER_ERROR:
            return (0, _extends3.default)({}, state, {
                viber: (0, _extends3.default)({}, state.viber, {
                    hasError: true
                })
            });
        case _integrationsActions.UNSET_VIBER_ERROR:
            return (0, _extends3.default)({}, state, {
                viber: (0, _extends3.default)({}, state.viber, {
                    hasError: false
                })
            });
        case _integrationsActions.SET_TWILIO_INTEGRATION_STATE:
            return (0, _extends3.default)({}, state, {
                twilio: (0, _extends3.default)({}, state.twilio, action.attrs)
            });
        case _integrationsActions.RESET_TWILIO_INTEGRATION_STATE:
            return INITIAL_STATE;
        default:
            return state;
    }
}