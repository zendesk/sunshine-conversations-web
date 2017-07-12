import * as AppStateActions from '../actions/app-state';
import { resetUnreadCount, connectFayeUser } from './conversation';
import { observable } from '../utils/events';
import { hasLinkableChannels, isChannelLinked } from '../utils/user';
import { getIntegration } from '../utils/app';
import { CHANNEL_DETAILS } from '../constants/channels';
import { WIDGET_STATE } from '../constants/app';

export function openWidget() {
    return (dispatch, getState) => {
        const {widgetState} = getState().appState;
        if (widgetState !== WIDGET_STATE.EMBEDDED) {
            dispatch(AppStateActions.openWidget());
            observable.trigger('widget:opened');
            dispatch(resetUnreadCount());
        }
    };
}

export function closeWidget() {
    return (dispatch, getState) => {
        const {widgetState} = getState().appState;
        if (widgetState !== WIDGET_STATE.EMBEDDED) {
            dispatch(AppStateActions.closeWidget());
            observable.trigger('widget:closed');
            dispatch(resetUnreadCount());
        }
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

function connectToFayeUser() {
    return (dispatch, getState) => {
        const {app: {integrations: appChannels, settings}, user: {clients}} = getState();

        if (hasLinkableChannels(appChannels, clients, settings.web)) {
            return dispatch(connectFayeUser());
        }

        return Promise.resolve();
    };
}

export function showSettings() {
    return (dispatch) => {
        dispatch(AppStateActions.showSettings());
        return dispatch(connectToFayeUser());
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
            dispatch(AppStateActions.showChannelPage(channelType));
            return dispatch(connectToFayeUser())
                .then(() => dispatch(channelDetails.onChannelPage()));
        }
    };
}

export function showTypingIndicator(data) {
    return (dispatch, getState) => {
        const {typingIndicatorTimeoutId} = getState().appState;

        if (typingIndicatorTimeoutId) {
            clearTimeout(typingIndicatorTimeoutId);
        }

        const timeoutId = setTimeout(() => {
            dispatch(hideTypingIndicator());
        }, 10 * 1000);

        dispatch(AppStateActions.showTypingIndicator({
            ...data,
            timeoutId
        }));
    };
}

export function hideTypingIndicator() {
    return (dispatch, getState) => {
        const {typingIndicatorTimeoutId} = getState().appState;

        if (typingIndicatorTimeoutId) {
            clearTimeout(typingIndicatorTimeoutId);
        }

        dispatch(AppStateActions.hideTypingIndicator());
    };
}
