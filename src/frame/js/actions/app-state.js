import { resetUnreadCount, connectFayeUser } from './conversation';
import { observable } from '../utils/events';
import { hasLinkableChannels, isChannelLinked } from '../utils/user';
import { getIntegration } from '../utils/app';
import { CHANNEL_DETAILS } from '../constants/channels';
import { WIDGET_STATE } from '../constants/app';

export const OPEN_WIDGET = 'OPEN_WIDGET';
export const CLOSE_WIDGET = 'CLOSE_WIDGET';
export const ENABLE_SETTINGS = 'ENABLE_SETTINGS';
export const DISABLE_SETTINGS = 'DISABLE_SETTINGS';
export const ENABLE_SOUND_NOTIFICATION = 'ENABLE_SOUND_NOTIFICATION';
export const DISABLE_SOUND_NOTIFICATION = 'DISABLE_SOUND_NOTIFICATION';
export const SHOW_SETTINGS = 'SHOW_SETTINGS';
export const HIDE_SETTINGS = 'HIDE_SETTINGS';
export const SHOW_CONNECT_NOTIFICATION = 'SHOW_CONNECT_NOTIFICATION';
export const HIDE_CONNECT_NOTIFICATION = 'HIDE_CONNECT_NOTIFICATION';
export const SHOW_ERROR_NOTIFICATION = 'SHOW_ERROR_NOTIFICATION';
export const HIDE_ERROR_NOTIFICATION = 'HIDE_ERROR_NOTIFICATION';
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
export const UPDATE_WIDGET_SIZE = 'UPDATE_WIDGET_SIZE';

function connectToFayeUser() {
    return (dispatch, getState) => {
        const {app: {integrations: appChannels, settings}, user: {clients}} = getState();

        if (hasLinkableChannels(appChannels, clients, settings.web)) {
            return dispatch(connectFayeUser());
        }

        return Promise.resolve();
    };
}

export function toggleWidget() {
    return (dispatch, getState) => {
        const {widgetState} = getState().appState;
        if (widgetState !== WIDGET_STATE.EMBEDDED) {
            if (widgetState === WIDGET_STATE.OPENED) {
                return dispatch(closeWidget());
            }
            return dispatch(openWidget());
        }
    };
}

export function openWidget() {
    return (dispatch, getState) => {
        const {widgetState} = getState().appState;
        if (widgetState !== WIDGET_STATE.EMBEDDED) {
            dispatch({
                type: OPEN_WIDGET
            });
            observable.trigger('widget:opened');
            dispatch(resetUnreadCount());
        }
    };
}

export function closeWidget() {
    return (dispatch, getState) => {
        const {widgetState} = getState().appState;
        if (widgetState !== WIDGET_STATE.EMBEDDED) {
            dispatch({
                type: CLOSE_WIDGET
            });
            observable.trigger('widget:closed');
            dispatch(resetUnreadCount());
        }
    };
}

export function showSettings() {
    return (dispatch) => {
        dispatch({
            type: SHOW_SETTINGS
        });
        return dispatch(connectToFayeUser());
    };
}

export function hideSettings() {
    return {
        type: HIDE_SETTINGS
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

export function showConnectNotification(timestamp = Date.now() / 1000.0) {
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
    return (dispatch, getState) => {
        const {user, app: {integrations}} = getState();
        const channelDetails = CHANNEL_DETAILS[channelType];
        const isLinked = isChannelLinked(user.clients, channelType);
        const appChannel = getIntegration(integrations, channelType);
        const url = channelDetails.getURL(appChannel);
        const openLink = url && (!channelDetails.Component || isLinked);

        if (openLink) {
            window.open(url);
            if (!isLinked && channelDetails.isLinkable) {
                return dispatch(connectToFayeUser());
            }
        } else {
            dispatch({
                type: SHOW_CHANNEL_PAGE,
                channelType
            });

            return dispatch(connectToFayeUser())
                .then(() => dispatch(channelDetails.onChannelPage()));
        }
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


export function showTypingIndicator({avatarUrl, name}) {
    return (dispatch, getState) => {
        const {typingIndicatorTimeoutId} = getState().appState;

        if (typingIndicatorTimeoutId) {
            clearTimeout(typingIndicatorTimeoutId);
        }

        const timeoutId = setTimeout(() => {
            dispatch(hideTypingIndicator());
        }, 10 * 1000);

        dispatch({
            type: SHOW_TYPING_INDICATOR,
            avatarUrl,
            name,
            timeoutId
        });
    };
}

export function hideTypingIndicator() {
    return (dispatch, getState) => {
        const {typingIndicatorTimeoutId} = getState().appState;

        if (typingIndicatorTimeoutId) {
            clearTimeout(typingIndicatorTimeoutId);
        }

        dispatch({
            type: HIDE_TYPING_INDICATOR
        });
    };
}

export function updateWidgetSize(size) {
    return {
        type: UPDATE_WIDGET_SIZE,
        size
    };
}
