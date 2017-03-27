import { RESET_APP } from '../actions/app-actions';
import { RESET } from '../actions/common-actions';

import { SET_ERROR, UNSET_ERROR, SET_WECHAT_QR_CODE, SET_TWILIO_INTEGRATION_STATE, RESET_TWILIO_INTEGRATION_STATE, RESET_INTEGRATIONS, SET_VIBER_QR_CODE, SET_TRANSFER_REQUEST_CODE, RESET_TRANSFER_REQUEST_CODE } from '../actions/integrations-actions';

const INITIAL_STATE = {
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

export function IntegrationsReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case RESET_APP:
        case RESET_INTEGRATIONS:
            return {
                ...INITIAL_STATE
            };
        case SET_ERROR:
            return {
                ...state,
                [action.channel]: {
                    ...state[action.channel],
                    hasError: true
                }
            }
        case UNSET_ERROR:
            return {
                ...state,
                [action.channel]: {
                    ...state[action.channel],
                    hasError: false
                }
            }
        case SET_WECHAT_QR_CODE:
            return {
                ...state,
                wechat: {
                    ...state.wechat,
                    qrCode: action.code
                }
            };
        case SET_VIBER_QR_CODE:
            return {
                ...state,
                viber: {
                    ...state.viber,
                    qrCode: action.code
                }
            };
        case SET_TWILIO_INTEGRATION_STATE:
            return {
                ...state,
                twilio: {
                    ...state.twilio,
                    ...action.attrs
                }
            };
        case RESET_TWILIO_INTEGRATION_STATE:
            return INITIAL_STATE;
        case SET_TRANSFER_REQUEST_CODE:
            return {
                ...state,
                [action.channel]: {
                    ...state[action.channel],
                    transferRequestCode: action.transferRequestCode
                }
            };
        case RESET_TRANSFER_REQUEST_CODE:
            return {
                ...state,
                [action.channel]: {
                    ...state[action.channel],
                    transferRequestCode: ''
                }
            };

        default:
            return state;
    }
}
