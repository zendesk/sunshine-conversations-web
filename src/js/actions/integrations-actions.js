export const SET_WECHAT_QR_CODE = 'SET_WECHAT_QR_CODE';
export const SET_WECHAT_ERROR = 'SET_WECHAT_ERROR';
export const UNSET_WECHAT_ERROR = 'UNSET_WECHAT_ERROR';
export const SET_TWILIO_INTEGRATION_STATE = 'SET_TWILIO_INTEGRATION_STATE';
export const RESET_TWILIO_INTEGRATION_STATE = 'RESET_TWILIO_INTEGRATION_STATE';

export function setWeChatQRCode(code) {
    return {
        type: SET_WECHAT_QR_CODE,
        code
    };
}

export function setWeChatError() {
    return {
        type: SET_WECHAT_ERROR
    };
}

export function unsetWeChatError() {
    return {
        type: UNSET_WECHAT_ERROR
    };
}

export function setTwilioIntegrationState(attrs) {
    return {
        type: SET_TWILIO_INTEGRATION_STATE,
        attrs
    };
}

export function resetTwilioIntegrationState() {
    return {
        type: RESET_TWILIO_INTEGRATION_STATE
    };
}
