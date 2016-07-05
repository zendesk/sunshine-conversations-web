import { RESET_APP } from '../actions/app-actions';
import { RESET } from '../actions/common-actions';
import { SET_WECHAT_QR_CODE, SET_WECHAT_ERROR, UNSET_WECHAT_ERROR, RESET_INTEGRATIONS } from '../actions/integrations-actions';

const INITIAL_STATE = {
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
        default:
            return state;
    }
}
