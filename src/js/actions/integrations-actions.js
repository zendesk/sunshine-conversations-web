export const SET_ERROR = 'SET_ERROR';
export const UNSET_ERROR = 'UNSET_ERROR';
export const SET_WECHAT_QR_CODE = 'SET_WECHAT_QR_CODE';
export const RESET_INTEGRATIONS = 'RESET_INTEGRATIONS';
export const SET_TWILIO_INTEGRATION_STATE = 'SET_TWILIO_INTEGRATION_STATE';
export const RESET_TWILIO_INTEGRATION_STATE = 'RESET_TWILIO_INTEGRATION_STATE';
export const SET_VIBER_QR_CODE = 'SET_VIBER_QR_CODE';
export const SET_TRANSFER_REQUEST_CODE = 'SET_TRANSFER_REQUEST_CODE';
export const RESET_TRANSFER_REQUEST_CODE = 'RESET_TRANSFER_REQUEST_CODE';

export function setError(channel) {
    return {
        type: SET_ERROR,
        channel
    }
}

export function unsetError(channel) {
    return {
        type: UNSET_ERROR,
        channel
    }
}

export function setWeChatQRCode(code) {
    return {
        type: SET_WECHAT_QR_CODE,
        code
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

export function setTransferRequestCode(channel, transferRequestCode) {
    return {
        type: SET_TRANSFER_REQUEST_CODE,
        channel,
        transferRequestCode
    }
}

export function resetTransferRequestCode(channel) {
    return {
        type: RESET_TRANSFER_REQUEST_CODE,
        channel
    }
}
