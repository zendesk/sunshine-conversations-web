'use strict';

exports.__esModule = true;
exports.toggleWidget = toggleWidget;
exports.openWidget = openWidget;
exports.closeWidget = closeWidget;
exports.showSettings = showSettings;
exports.hideSettings = hideSettings;
exports.enableSettings = enableSettings;
exports.disableSettings = disableSettings;
exports.enableImageUpload = enableImageUpload;
exports.disableImageUpload = disableImageUpload;
exports.enableSoundNotification = enableSoundNotification;
exports.disableSoundNotification = disableSoundNotification;
exports.setEmailReadonly = setEmailReadonly;
exports.unsetEmailReadonly = unsetEmailReadonly;
exports.showSettingsNotification = showSettingsNotification;
exports.hideSettingsNotification = hideSettingsNotification;
exports.setServerURL = setServerURL;
exports.showErrorNotification = showErrorNotification;
exports.hideErrorNotification = hideErrorNotification;
exports.setEmbedded = setEmbedded;
var TOGGLE_WIDGET = exports.TOGGLE_WIDGET = 'TOGGLE_WIDGET';
var OPEN_WIDGET = exports.OPEN_WIDGET = 'OPEN_WIDGET';
var CLOSE_WIDGET = exports.CLOSE_WIDGET = 'CLOSE_WIDGET';
var ENABLE_SETTINGS = exports.ENABLE_SETTINGS = 'ENABLE_SETTINGS';
var DISABLE_SETTINGS = exports.DISABLE_SETTINGS = 'DISABLE_SETTINGS';
var ENABLE_SOUND_NOTIFICATION = exports.ENABLE_SOUND_NOTIFICATION = 'ENABLE_SOUND_NOTIFICATION';
var DISABLE_SOUND_NOTIFICATION = exports.DISABLE_SOUND_NOTIFICATION = 'DISABLE_SOUND_NOTIFICATION';
var SHOW_SETTINGS = exports.SHOW_SETTINGS = 'SHOW_SETTINGS';
var HIDE_SETTINGS = exports.HIDE_SETTINGS = 'HIDE_SETTINGS';
var SHOW_SETTINGS_NOTIFICATION = exports.SHOW_SETTINGS_NOTIFICATION = 'SHOW_SETTINGS_NOTIFICATION';
var HIDE_SETTINGS_NOTIFICATION = exports.HIDE_SETTINGS_NOTIFICATION = 'HIDE_SETTINGS_NOTIFICATION';
var SHOW_ERROR_NOTIFICATION = exports.SHOW_ERROR_NOTIFICATION = 'SHOW_ERROR_NOTIFICATION';
var HIDE_ERROR_NOTIFICATION = exports.HIDE_ERROR_NOTIFICATION = 'HIDE_ERROR_NOTIFICATION';
var SET_SERVER_URL = exports.SET_SERVER_URL = 'SET_SERVER_URL';
var SET_EMAIL_READONLY = exports.SET_EMAIL_READONLY = 'SET_EMAIL_READONLY';
var UNSET_EMAIL_READONLY = exports.UNSET_EMAIL_READONLY = 'UNSET_EMAIL_READONLY';
var SET_EMBEDDED = exports.SET_EMBEDDED = 'SET_EMBEDDED';
var ENABLE_IMAGE_UPLOAD = exports.ENABLE_IMAGE_UPLOAD = 'ENABLE_IMAGE_UPLOAD';
var DISABLE_IMAGE_UPLOAD = exports.DISABLE_IMAGE_UPLOAD = 'DISABLE_IMAGE_UPLOAD';

function toggleWidget() {
    return {
        type: TOGGLE_WIDGET
    };
}

function openWidget() {
    return {
        type: OPEN_WIDGET
    };
}

function closeWidget() {
    return {
        type: CLOSE_WIDGET
    };
}

function showSettings() {
    return {
        type: SHOW_SETTINGS
    };
}

function hideSettings() {
    return {
        type: HIDE_SETTINGS
    };
}

function enableSettings() {
    return {
        type: ENABLE_SETTINGS
    };
}

function disableSettings() {
    return {
        type: DISABLE_SETTINGS
    };
}

function enableImageUpload() {
    return {
        type: ENABLE_IMAGE_UPLOAD
    };
}

function disableImageUpload() {
    return {
        type: DISABLE_IMAGE_UPLOAD
    };
}

function enableSoundNotification() {
    return {
        type: ENABLE_SOUND_NOTIFICATION
    };
}

function disableSoundNotification() {
    return {
        type: DISABLE_SOUND_NOTIFICATION
    };
}

function setEmailReadonly() {
    return {
        type: SET_EMAIL_READONLY
    };
}

function unsetEmailReadonly() {
    return {
        type: UNSET_EMAIL_READONLY
    };
}

function showSettingsNotification() {
    return {
        type: SHOW_SETTINGS_NOTIFICATION
    };
}

function hideSettingsNotification() {
    return {
        type: HIDE_SETTINGS_NOTIFICATION
    };
}

function setServerURL(url) {
    return {
        type: SET_SERVER_URL,
        url: url
    };
}

function showErrorNotification(message) {
    return function (dispatch) {
        setTimeout(function () {
            dispatch(hideErrorNotification());
        }, 10000);

        dispatch({
            type: SHOW_ERROR_NOTIFICATION,
            message: message
        });
    };
}

function hideErrorNotification() {
    return {
        type: HIDE_ERROR_NOTIFICATION
    };
}

function setEmbedded(value) {
    return {
        type: SET_EMBEDDED,
        value: value
    };
}