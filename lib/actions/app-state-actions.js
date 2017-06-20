'use strict';

exports.__esModule = true;
exports.toggleWidget = toggleWidget;
exports.openWidget = openWidget;
exports.closeWidget = closeWidget;
exports.showSettings = showSettings;
exports.hideSettings = hideSettings;
exports.enableEmailCapture = enableEmailCapture;
exports.disableEmailCapture = disableEmailCapture;
exports.enableImageUpload = enableImageUpload;
exports.disableImageUpload = disableImageUpload;
exports.enableSoundNotification = enableSoundNotification;
exports.disableSoundNotification = disableSoundNotification;
exports.setEmailReadonly = setEmailReadonly;
exports.unsetEmailReadonly = unsetEmailReadonly;
exports.showConnectNotification = showConnectNotification;
exports.hideConnectNotification = hideConnectNotification;
exports.setServerURL = setServerURL;
exports.showErrorNotification = showErrorNotification;
exports.hideErrorNotification = hideErrorNotification;
exports.setEmbedded = setEmbedded;
exports.showChannelPage = showChannelPage;
exports.hideChannelPage = hideChannelPage;
exports.setIntroHeight = setIntroHeight;
exports.disableAnimation = disableAnimation;
exports.setFetchingMoreMessages = setFetchingMoreMessages;
exports.setShouldScrollToBottom = setShouldScrollToBottom;
exports.showTypingIndicator = showTypingIndicator;
exports.hideTypingIndicator = hideTypingIndicator;
var TOGGLE_WIDGET = exports.TOGGLE_WIDGET = 'TOGGLE_WIDGET';
var OPEN_WIDGET = exports.OPEN_WIDGET = 'OPEN_WIDGET';
var CLOSE_WIDGET = exports.CLOSE_WIDGET = 'CLOSE_WIDGET';
var ENABLE_SETTINGS = exports.ENABLE_SETTINGS = 'ENABLE_SETTINGS';
var DISABLE_SETTINGS = exports.DISABLE_SETTINGS = 'DISABLE_SETTINGS';
var ENABLE_EMAIL_CAPTURE = exports.ENABLE_EMAIL_CAPTURE = 'ENABLE_EMAIL_CAPTURE';
var DISABLE_EMAIL_CAPTURE = exports.DISABLE_EMAIL_CAPTURE = 'DISABLE_EMAIL_CAPTURE';
var ENABLE_SOUND_NOTIFICATION = exports.ENABLE_SOUND_NOTIFICATION = 'ENABLE_SOUND_NOTIFICATION';
var DISABLE_SOUND_NOTIFICATION = exports.DISABLE_SOUND_NOTIFICATION = 'DISABLE_SOUND_NOTIFICATION';
var SHOW_SETTINGS = exports.SHOW_SETTINGS = 'SHOW_SETTINGS';
var HIDE_SETTINGS = exports.HIDE_SETTINGS = 'HIDE_SETTINGS';
var SHOW_CONNECT_NOTIFICATION = exports.SHOW_CONNECT_NOTIFICATION = 'SHOW_CONNECT_NOTIFICATION';
var HIDE_CONNECT_NOTIFICATION = exports.HIDE_CONNECT_NOTIFICATION = 'HIDE_CONNECT_NOTIFICATION';
var SHOW_ERROR_NOTIFICATION = exports.SHOW_ERROR_NOTIFICATION = 'SHOW_ERROR_NOTIFICATION';
var HIDE_ERROR_NOTIFICATION = exports.HIDE_ERROR_NOTIFICATION = 'HIDE_ERROR_NOTIFICATION';
var SET_SERVER_URL = exports.SET_SERVER_URL = 'SET_SERVER_URL';
var SET_EMAIL_READONLY = exports.SET_EMAIL_READONLY = 'SET_EMAIL_READONLY';
var UNSET_EMAIL_READONLY = exports.UNSET_EMAIL_READONLY = 'UNSET_EMAIL_READONLY';
var SET_EMBEDDED = exports.SET_EMBEDDED = 'SET_EMBEDDED';
var ENABLE_IMAGE_UPLOAD = exports.ENABLE_IMAGE_UPLOAD = 'ENABLE_IMAGE_UPLOAD';
var DISABLE_IMAGE_UPLOAD = exports.DISABLE_IMAGE_UPLOAD = 'DISABLE_IMAGE_UPLOAD';
var SHOW_CHANNEL_PAGE = exports.SHOW_CHANNEL_PAGE = 'SHOW_CHANNEL_PAGE';
var HIDE_CHANNEL_PAGE = exports.HIDE_CHANNEL_PAGE = 'HIDE_CHANNEL_PAGE';
var SET_INTRO_HEIGHT = exports.SET_INTRO_HEIGHT = 'SET_INTRO_HEIGHT';
var DISABLE_ANIMATION = exports.DISABLE_ANIMATION = 'DISABLE_ANIMATION';
var SET_FETCHING_MORE_MESSAGES = exports.SET_FETCHING_MORE_MESSAGES = 'SET_FETCHING_MORE_MESSAGES';
var SET_SHOULD_SCROLL_TO_BOTTOM = exports.SET_SHOULD_SCROLL_TO_BOTTOM = 'SET_SHOULD_SCROLL_TO_BOTTOM';
var SHOW_TYPING_INDICATOR = exports.SHOW_TYPING_INDICATOR = 'SHOW_TYPING_INDICATOR';
var HIDE_TYPING_INDICATOR = exports.HIDE_TYPING_INDICATOR = 'HIDE_TYPING_INDICATOR';

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

function enableEmailCapture() {
    return {
        type: ENABLE_EMAIL_CAPTURE
    };
}

function disableEmailCapture() {
    return {
        type: DISABLE_EMAIL_CAPTURE
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

function showConnectNotification(timestamp) {
    return {
        type: SHOW_CONNECT_NOTIFICATION,
        timestamp: timestamp
    };
}

function hideConnectNotification() {
    return {
        type: HIDE_CONNECT_NOTIFICATION
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

function showChannelPage(channelType) {
    return {
        type: SHOW_CHANNEL_PAGE,
        channelType: channelType
    };
}

function hideChannelPage() {
    return {
        type: HIDE_CHANNEL_PAGE
    };
}

function setIntroHeight(value) {
    return {
        type: SET_INTRO_HEIGHT,
        value: value
    };
}

function disableAnimation() {
    return {
        type: DISABLE_ANIMATION
    };
}

function setFetchingMoreMessages(value) {
    return {
        type: SET_FETCHING_MORE_MESSAGES,
        value: value
    };
}

function setShouldScrollToBottom(value) {
    return {
        type: SET_SHOULD_SCROLL_TO_BOTTOM,
        value: value
    };
}

function showTypingIndicator(_ref) {
    var avatarUrl = _ref.avatarUrl,
        name = _ref.name,
        timeoutId = _ref.timeoutId;

    return {
        type: SHOW_TYPING_INDICATOR,
        avatarUrl: avatarUrl,
        name: name,
        timeoutId: timeoutId
    };
}

function hideTypingIndicator() {
    return {
        type: HIDE_TYPING_INDICATOR
    };
}