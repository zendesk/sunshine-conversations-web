import { RESET_APP } from '../actions/app-actions';
import { RESET } from '../actions/common-actions';

import { SET_WECHAT_QR_CODE, SET_WECHAT_ERROR, UNSET_WECHAT_ERROR, SET_TWILIO_INTEGRATION_STATE, RESET_TWILIO_INTEGRATION_STATE, RESET_INTEGRATIONS, SET_VIBER_QR_CODE, SET_VIBER_ERROR, UNSET_VIBER_ERROR, SET_TRANSFER_REQUEST_CODE} from '../actions/integrations-actions';

const INITIAL_STATE = {
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
    },
    messenger: {
        hasError: false,
        transferRequestCode: ''
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
        case SET_WECHAT_QR_CODE:
            return {
                ...state,
                wechat: {
                    ...state.wechat,
                    qrCode: action.code
                }
            };
        case SET_WECHAT_ERROR:
            return {
                ...state,
                wechat: {
                    ...state.wechat,
                    hasError: true
                }
            };
        case UNSET_WECHAT_ERROR:
            return {
                ...state,
                wechat: {
                    ...state.wechat,
                    hasError: false
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
        case SET_VIBER_ERROR:
            return {
                ...state,
                viber: {
                    ...state.viber,
                    hasError: true
                }
            };
        case UNSET_VIBER_ERROR:
            return {
                ...state,
                viber: {
                    ...state.viber,
                    hasError: false
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

        default:
            return state;
    }
}
