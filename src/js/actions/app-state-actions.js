export const TOGGLE_WIDGET = 'TOGGLE_WIDGET';
export const OPEN_WIDGET = 'OPEN_WIDGET';
export const CLOSE_WIDGET = 'CLOSE_WIDGET';
export const ENABLE_SETTINGS = 'ENABLE_SETTINGS';
export const DISABLE_SETTINGS = 'DISABLE_SETTINGS';
export const ENABLE_EMAIL_CAPTURE = 'ENABLE_EMAIL_CAPTURE';
export const DISABLE_EMAIL_CAPTURE = 'DISABLE_EMAIL_CAPTURE';
export const ENABLE_SOUND_NOTIFICATION = 'ENABLE_SOUND_NOTIFICATION';
export const DISABLE_SOUND_NOTIFICATION = 'DISABLE_SOUND_NOTIFICATION';
export const SHOW_SETTINGS = 'SHOW_SETTINGS';
export const HIDE_SETTINGS = 'HIDE_SETTINGS';
export const SHOW_CONNECT_NOTIFICATION = 'SHOW_CONNECT_NOTIFICATION';
export const HIDE_CONNECT_NOTIFICATION = 'HIDE_CONNECT_NOTIFICATION';
export const SHOW_ERROR_NOTIFICATION = 'SHOW_ERROR_NOTIFICATION';
export const HIDE_ERROR_NOTIFICATION = 'HIDE_ERROR_NOTIFICATION';
export const SET_SERVER_URL = 'SET_SERVER_URL';
export const SET_EMAIL_READONLY = 'SET_EMAIL_READONLY';
export const UNSET_EMAIL_READONLY = 'UNSET_EMAIL_READONLY';
export const SET_EMBEDDED = 'SET_EMBEDDED';
export const ENABLE_IMAGE_UPLOAD = 'ENABLE_IMAGE_UPLOAD';
export const DISABLE_IMAGE_UPLOAD = 'DISABLE_IMAGE_UPLOAD';
export const SHOW_CHANNEL_PAGE = 'SHOW_CHANNEL_PAGE';
export const HIDE_CHANNEL_PAGE = 'HIDE_CHANNEL_PAGE';
export const SET_INTRO_HEIGHT = 'SET_INTRO_HEIGHT';
export const DISABLE_ANIMATION = 'DISABLE_ANIMATION';
export const SET_FETCHING_MORE_MESSAGES = 'SET_FETCHING_MORE_MESSAGES';
export const SET_SHOULD_SCROLL_TO_BOTTOM = 'SET_SHOULD_SCROLL_TO_BOTTOM';
export const SHOW_TYPING_INDICATOR = 'SHOW_TYPING_INDICATOR';
export const HIDE_TYPING_INDICATOR = 'HIDE_TYPING_INDICATOR';

export function toggleWidget() {
    return {
        type: TOGGLE_WIDGET
    };
}

export function openWidget() {
    return {
        type: OPEN_WIDGET
    };
}

export function closeWidget() {
    return {
        type: CLOSE_WIDGET
    };
}

export function showSettings() {
    return {
        type: SHOW_SETTINGS
    };
}

export function hideSettings() {
    return {
        type: HIDE_SETTINGS
    };
}

export function enableEmailCapture() {
    return {
        type: ENABLE_EMAIL_CAPTURE
    };
}

export function disableEmailCapture() {
    return {
        type: DISABLE_EMAIL_CAPTURE
    };
}

export function enableImageUpload() {
    return {
        type: ENABLE_IMAGE_UPLOAD
    };
}

export function disableImageUpload() {
    return {
        type: DISABLE_IMAGE_UPLOAD
    };
}

export function enableSoundNotification() {
    return {
        type: ENABLE_SOUND_NOTIFICATION
    };
}

export function disableSoundNotification() {
    return {
        type: DISABLE_SOUND_NOTIFICATION
    };
}

export function setEmailReadonly() {
    return {
        type: SET_EMAIL_READONLY
    };
}

export function unsetEmailReadonly() {
    return {
        type: UNSET_EMAIL_READONLY
    };
}

export function showConnectNotification(timestamp) {
    return {
        type: SHOW_CONNECT_NOTIFICATION,
        timestamp
    };
}

export function hideConnectNotification() {
    return {
        type: HIDE_CONNECT_NOTIFICATION
    };
}

export function setServerURL(url) {
    return {
        type: SET_SERVER_URL,
        url: url
    };
}

export function showErrorNotification(message) {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(hideErrorNotification());
        }, 10000);

        dispatch({
            type: SHOW_ERROR_NOTIFICATION,
            message
        });
    };
}

export function hideErrorNotification() {
    return {
        type: HIDE_ERROR_NOTIFICATION
    };
}

export function setEmbedded(value) {
    return {
        type: SET_EMBEDDED,
        value
    };
}

export function showChannelPage(channelType) {
    return {
        type: SHOW_CHANNEL_PAGE,
        channelType
    };
}

export function hideChannelPage() {
    return {
        type: HIDE_CHANNEL_PAGE
    };
}

export function setIntroHeight(value) {
    return {
        type: SET_INTRO_HEIGHT,
        value
    };
}

export function disableAnimation() {
    return {
        type: DISABLE_ANIMATION
    };
}

export function setFetchingMoreMessages(value) {
    return {
        type: SET_FETCHING_MORE_MESSAGES,
        value
    };
}

export function setShouldScrollToBottom(value) {
    return {
        type: SET_SHOULD_SCROLL_TO_BOTTOM,
        value
    };
}

export function showTypingIndicator({avatarUrl, name, timeoutId}) {
    return {
        type: SHOW_TYPING_INDICATOR,
        avatarUrl,
        name,
        timeoutId
    };
}

export function hideTypingIndicator() {
    return {
        type: HIDE_TYPING_INDICATOR
    };
}
