'use strict';

exports.__esModule = true;
exports.setWeChatQRCode = setWeChatQRCode;
exports.setWeChatError = setWeChatError;
exports.unsetWeChatError = unsetWeChatError;
var SET_WECHAT_QR_CODE = exports.SET_WECHAT_QR_CODE = 'SET_WECHAT_QR_CODE';
var SET_WECHAT_ERROR = exports.SET_WECHAT_ERROR = 'SET_WECHAT_ERROR';
var UNSET_WECHAT_ERROR = exports.UNSET_WECHAT_ERROR = 'UNSET_WECHAT_ERROR';

function setWeChatQRCode(code) {
    return {
        type: SET_WECHAT_QR_CODE,
        code: code
    };
}

function setWeChatError() {
    return {
        type: SET_WECHAT_ERROR
    };
}

function unsetWeChatError() {
    return {
        type: UNSET_WECHAT_ERROR
    };
}