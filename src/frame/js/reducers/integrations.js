import { RESET_CONFIG } from '../actions/config';
import { RESET } from '../actions/common';

import { SET_ERROR, UNSET_ERROR, SET_WECHAT_QR_CODE, SET_TWILIO_INTEGRATION_STATE, RESET_TWILIO_INTEGRATION_STATE, SET_MESSAGEBIRD_INTEGRATION_STATE, RESET_MESSAGEBIRD_INTEGRATION_STATE, RESET_INTEGRATIONS, SET_VIBER_QR_CODE, SET_TRANSFER_REQUEST_CODE, RESET_TRANSFER_REQUEST_CODE } from '../actions/integrations';

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

export default function IntegrationsReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case RESET_CONFIG:
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
            };
        case UNSET_ERROR:
            return {
                ...state,
                [action.channel]: {
                    ...state[action.channel],
                    hasError: false
                }
            };
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
        case SET_MESSAGEBIRD_INTEGRATION_STATE:
            return {
                ...state,
                messagebird: {
                    ...state.messagebird,
                    ...action.attrs
                }
            };
        case RESET_MESSAGEBIRD_INTEGRATION_STATE:
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
