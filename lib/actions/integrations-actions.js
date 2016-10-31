'use strict';

exports.__esModule = true;
exports.setWeChatQRCode = setWeChatQRCode;
exports.setWeChatError = setWeChatError;
exports.unsetWeChatError = unsetWeChatError;
exports.resetIntegrations = resetIntegrations;
exports.setTwilioIntegrationState = setTwilioIntegrationState;
exports.resetTwilioIntegrationState = resetTwilioIntegrationState;
var SET_WECHAT_QR_CODE = exports.SET_WECHAT_QR_CODE = 'SET_WECHAT_QR_CODE';
var SET_WECHAT_ERROR = exports.SET_WECHAT_ERROR = 'SET_WECHAT_ERROR';
var UNSET_WECHAT_ERROR = exports.UNSET_WECHAT_ERROR = 'UNSET_WECHAT_ERROR';
var RESET_INTEGRATIONS = exports.RESET_INTEGRATIONS = 'RESET_INTEGRATIONS';
var SET_TWILIO_INTEGRATION_STATE = exports.SET_TWILIO_INTEGRATION_STATE = 'SET_TWILIO_INTEGRATION_STATE';
var RESET_TWILIO_INTEGRATION_STATE = exports.RESET_TWILIO_INTEGRATION_STATE = 'RESET_TWILIO_INTEGRATION_STATE';

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

function resetIntegrations() {
    return {
        type: RESET_INTEGRATIONS
    };
}
function setTwilioIntegrationState(attrs) {
    return {
        type: SET_TWILIO_INTEGRATION_STATE,
        attrs: attrs
    };
}

function resetTwilioIntegrationState() {
    return {
        type: RESET_TWILIO_INTEGRATION_STATE
    };
}