export const SET_WECHAT_QR_CODE = 'SET_WECHAT_QR_CODE';
export const SET_WECHAT_ERROR = 'SET_WECHAT_ERROR';
export const UNSET_WECHAT_ERROR = 'UNSET_WECHAT_ERROR';
export const RESET_INTEGRATIONS = 'RESET_INTEGRATIONS';
export const SET_TWILIO_INTEGRATION_STATE = 'SET_TWILIO_INTEGRATION_STATE';
export const RESET_TWILIO_INTEGRATION_STATE = 'RESET_TWILIO_INTEGRATION_STATE';
export const SET_VIBER_QR_CODE = 'SET_VIBER_QR_CODE';
export const SET_VIBER_ERROR = 'SET_VIBER_ERROR';
export const UNSET_VIBER_ERROR = 'UNSET_VIBER_ERROR';

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

export function resetIntegrations() {
    return {
        type: RESET_INTEGRATIONS
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

export function setViberQRCode(code) {
    return {
        type: SET_VIBER_QR_CODE,
        code
    };
}

export function setViberError() {
    return {
        type: SET_VIBER_ERROR
    };
}

export function unsetViberError() {
    return {
        type: UNSET_VIBER_ERROR
    };
}
