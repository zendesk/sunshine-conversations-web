import { store } from '../stores/app-store';
import * as AppStateActions from '../actions/app-state-actions';
import { preventMobilePageScroll, allowMobilePageScroll } from '../utils/dom';
import { resetUnreadCount, connectFayeUser } from './conversation-service';
import { observable } from '../utils/events';
import { hasLinkableChannels, isChannelLinked } from '../utils/user';
import { getIntegration } from '../utils/app';
import { CHANNEL_DETAILS } from '../constants/channels';
import { WIDGET_STATE } from '../constants/app';

export function openWidget() {
    const {embedded} = store.getState().appState;
    if (!embedded) {
        store.dispatch(AppStateActions.openWidget());
        observable.trigger('widget:opened');
        resetUnreadCount();
        preventMobilePageScroll();
    }
}

export function closeWidget() {
    const {embedded} = store.getState().appState;
    if (!embedded) {
        store.dispatch(AppStateActions.closeWidget());
        observable.trigger('widget:closed');
        resetUnreadCount();
        allowMobilePageScroll();
    }
}


export function toggleWidget() {
    const {embedded, widgetState} = store.getState().appState;
    if (!embedded) {
        if (widgetState === WIDGET_STATE.OPENED) {
            closeWidget();
        } else {
            openWidget();
        }
    }
}

function connectToFayeUser() {
    const {app: {integrations: appChannels, settings}, user: {clients}} = store.getState();

    if (hasLinkableChannels(appChannels, clients, settings.web)) {
        return connectFayeUser();
    }

    return Promise.resolve();
}

export function showSettings() {
    store.dispatch(AppStateActions.showSettings());
    return connectToFayeUser();
}

export function hideSettings() {
    store.dispatch(AppStateActions.hideSettings());
}

export function showChannelPage(channelType) {
    const {user, app: {integrations}} = store.getState();
    const channelDetails = CHANNEL_DETAILS[channelType];
    const isLinked = isChannelLinked(user.clients, channelType);
    const openLink = channelDetails.getURL && (!channelDetails.Component || isLinked);

    if (openLink) {
        const appChannel = getIntegration(integrations, channelType);
        const link = channelDetails.getURL(user, appChannel, isLinked);

        if (link) {
            window.open(link);
            return (isLinked || !channelDetails.isLinkable) ? Promise.resolve() : connectToFayeUser();
        }
    }

    store.dispatch(AppStateActions.showChannelPage(channelType));

    return connectToFayeUser().then(() => {
        channelDetails.onChannelPage();
    });
}

export function hideChannelPage() {
    store.dispatch(AppStateActions.hideChannelPage());
}

export function showConnectNotification() {
    store.dispatch(AppStateActions.showConnectNotification(Date.now() / 1000.0));
}

export function hideConnectNotification() {
    store.dispatch(AppStateActions.hideConnectNotification());
}

export function showTypingIndicator(data) {
    const {typingIndicatorTimeoutId} = store.getState().appState;

    if (typingIndicatorTimeoutId) {
        clearTimeout(typingIndicatorTimeoutId);
    }

    const timeoutId = setTimeout(() => {
        hideTypingIndicator();
    }, 10 * 1000);

    store.dispatch(AppStateActions.showTypingIndicator({
        ...data,
        timeoutId
    }));
}

export function hideTypingIndicator() {
    const {typingIndicatorTimeoutId} = store.getState().appState;

    if (typingIndicatorTimeoutId) {
        clearTimeout(typingIndicatorTimeoutId);
    }
    
    store.dispatch(AppStateActions.hideTypingIndicator());
}
