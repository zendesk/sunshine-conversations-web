export const SET_WECHAT_QR_CODE = 'SET_WECHAT_QR_CODE';
export const SET_WECHAT_ERROR = 'SET_WECHAT_ERROR';
export const UNSET_WECHAT_ERROR = 'UNSET_WECHAT_ERROR';

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
