'use strict';

exports.__esModule = true;

var _extends6 = require('babel-runtime/helpers/extends');

var _extends7 = _interopRequireDefault(_extends6);

exports.IntegrationsReducer = IntegrationsReducer;

var _appActions = require('../actions/app-actions');

var _commonActions = require('../actions/common-actions');

var _integrationsActions = require('../actions/integrations-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
    messenger: {
        hasError: false,
        transferRequestCode: ''
    },
    telegram: {
        hasError: false,
        transferRequestCode: ''
    },
    twilio: {
        linkState: 'unlinked',
        appUserNumber: '',
        hasError: false
    },
    messagebird: {
        linkState: 'unlinked',
        appUserNumber: '',
        hasError: false
    },
    viber: {
        hasError: false,
        transferRequestCode: '',
        qrCode: ''
    },
    wechat: {
        hasError: false,
        qrCode: ''
    }
};

function IntegrationsReducer() {
    var _extends2, _extends3, _extends4, _extends5;

    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
        case _appActions.RESET_APP:
        case _integrationsActions.RESET_INTEGRATIONS:
            return (0, _extends7.default)({}, INITIAL_STATE);
        case _integrationsActions.SET_ERROR:
            return (0, _extends7.default)({}, state, (_extends2 = {}, _extends2[action.channel] = (0, _extends7.default)({}, state[action.channel], {
                hasError: true
            }), _extends2));
        case _integrationsActions.UNSET_ERROR:
            return (0, _extends7.default)({}, state, (_extends3 = {}, _extends3[action.channel] = (0, _extends7.default)({}, state[action.channel], {
                hasError: false
            }), _extends3));
        case _integrationsActions.SET_WECHAT_QR_CODE:
            return (0, _extends7.default)({}, state, {
                wechat: (0, _extends7.default)({}, state.wechat, {
                    qrCode: action.code
                })
            });
        case _integrationsActions.SET_VIBER_QR_CODE:
            return (0, _extends7.default)({}, state, {
                viber: (0, _extends7.default)({}, state.viber, {
                    qrCode: action.code
                })
            });
        case _integrationsActions.SET_TWILIO_INTEGRATION_STATE:
            return (0, _extends7.default)({}, state, {
                twilio: (0, _extends7.default)({}, state.twilio, action.attrs)
            });
        case _integrationsActions.RESET_TWILIO_INTEGRATION_STATE:
            return INITIAL_STATE;
        case _integrationsActions.SET_MESSAGEBIRD_INTEGRATION_STATE:
            return (0, _extends7.default)({}, state, {
                messagebird: (0, _extends7.default)({}, state.messagebird, action.attrs)
            });
        case _integrationsActions.RESET_MESSAGEBIRD_INTEGRATION_STATE:
            return INITIAL_STATE;
        case _integrationsActions.SET_TRANSFER_REQUEST_CODE:
            return (0, _extends7.default)({}, state, (_extends4 = {}, _extends4[action.channel] = (0, _extends7.default)({}, state[action.channel], {
                transferRequestCode: action.transferRequestCode
            }), _extends4));
        case _integrationsActions.RESET_TRANSFER_REQUEST_CODE:
            return (0, _extends7.default)({}, state, (_extends5 = {}, _extends5[action.channel] = (0, _extends7.default)({}, state[action.channel], {
                transferRequestCode: ''
            }), _extends5));

        default:
            return state;
    }
}