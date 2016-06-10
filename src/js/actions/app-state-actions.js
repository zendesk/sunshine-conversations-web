export const TOGGLE_WIDGET = 'TOGGLE_WIDGET';
export const OPEN_WIDGET = 'OPEN_WIDGET';
export const CLOSE_WIDGET = 'CLOSE_WIDGET';
export const ENABLE_SETTINGS = 'ENABLE_SETTINGS';
export const DISABLE_SETTINGS = 'DISABLE_SETTINGS';
export const ENABLE_SOUND_NOTIFICATION = 'ENABLE_SOUND_NOTIFICATION';
export const DISABLE_SOUND_NOTIFICATION = 'DISABLE_SOUND_NOTIFICATION';
export const SHOW_SETTINGS = 'SHOW_SETTINGS';
export const HIDE_SETTINGS = 'HIDE_SETTINGS';
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';
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

export function enableSettings() {
    return {
        type: ENABLE_SETTINGS
    };
}

export function disableSettings() {
    return {
        type: DISABLE_SETTINGS
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

export function showNotification(message) {
    return {
        type: SHOW_NOTIFICATION,
        message
    };
}

export function hideNotification() {
    return {
        type: HIDE_NOTIFICATION
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
