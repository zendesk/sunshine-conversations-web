'use strict';

exports.__esModule = true;
exports.setError = setError;
exports.unsetError = unsetError;
exports.setWeChatQRCode = setWeChatQRCode;
exports.resetIntegrations = resetIntegrations;
exports.setTwilioIntegrationState = setTwilioIntegrationState;
exports.resetTwilioIntegrationState = resetTwilioIntegrationState;
exports.setMessageBirdIntegrationState = setMessageBirdIntegrationState;
exports.resetMessageBirdIntegrationState = resetMessageBirdIntegrationState;
exports.setViberQRCode = setViberQRCode;
exports.setTransferRequestCode = setTransferRequestCode;
exports.resetTransferRequestCode = resetTransferRequestCode;
var SET_ERROR = exports.SET_ERROR = 'SET_ERROR';
var UNSET_ERROR = exports.UNSET_ERROR = 'UNSET_ERROR';
var SET_WECHAT_QR_CODE = exports.SET_WECHAT_QR_CODE = 'SET_WECHAT_QR_CODE';
var RESET_INTEGRATIONS = exports.RESET_INTEGRATIONS = 'RESET_INTEGRATIONS';
var SET_TWILIO_INTEGRATION_STATE = exports.SET_TWILIO_INTEGRATION_STATE = 'SET_TWILIO_INTEGRATION_STATE';
var RESET_TWILIO_INTEGRATION_STATE = exports.RESET_TWILIO_INTEGRATION_STATE = 'RESET_TWILIO_INTEGRATION_STATE';
var SET_MESSAGEBIRD_INTEGRATION_STATE = exports.SET_MESSAGEBIRD_INTEGRATION_STATE = 'SET_MESSAGEBIRD_INTEGRATION_STATE';
var RESET_MESSAGEBIRD_INTEGRATION_STATE = exports.RESET_MESSAGEBIRD_INTEGRATION_STATE = 'RESET_MESSAGEBIRD_INTEGRATION_STATE';
var SET_VIBER_QR_CODE = exports.SET_VIBER_QR_CODE = 'SET_VIBER_QR_CODE';
var SET_TRANSFER_REQUEST_CODE = exports.SET_TRANSFER_REQUEST_CODE = 'SET_TRANSFER_REQUEST_CODE';
var RESET_TRANSFER_REQUEST_CODE = exports.RESET_TRANSFER_REQUEST_CODE = 'RESET_TRANSFER_REQUEST_CODE';

function setError(channel) {
    return {
        type: SET_ERROR,
        channel: channel
    };
}

function unsetError(channel) {
    return {
        type: UNSET_ERROR,
        channel: channel
    };
}

function setWeChatQRCode(code) {
    return {
        type: SET_WECHAT_QR_CODE,
        code: code
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

function setMessageBirdIntegrationState(attrs) {
    return {
        type: SET_MESSAGEBIRD_INTEGRATION_STATE,
        attrs: attrs
    };
}

function resetMessageBirdIntegrationState() {
    return {
        type: RESET_MESSAGEBIRD_INTEGRATION_STATE
    };
}

function setViberQRCode(code) {
    return {
        type: SET_VIBER_QR_CODE,
        code: code
    };
}

function setTransferRequestCode(channel, transferRequestCode) {
    return {
        type: SET_TRANSFER_REQUEST_CODE,
        channel: channel,
        transferRequestCode: transferRequestCode
    };
}

function resetTransferRequestCode(channel) {
    return {
        type: RESET_TRANSFER_REQUEST_CODE,
        channel: channel
    };
}