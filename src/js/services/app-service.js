import { store } from '../stores/app-store';
import * as AppStateActions from '../actions/app-state-actions';
import { preventMobilePageScroll, allowMobilePageScroll } from '../utils/dom';
import { resetUnreadCount, connectFayeUser } from './conversation-service';
import { observable } from '../utils/events';
import { hasLinkableChannels, isChannelLinked } from '../utils/user';
import { getIntegration } from '../utils/app';
import { CHANNEL_DETAILS } from '../constants/channels';

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
    const {embedded, widgetOpened} = store.getState().appState;
    if (!embedded) {
        if (widgetOpened) {
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
    return connectToFayeUser().then(() => {
        store.dispatch(AppStateActions.showSettings());
    });
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
            return isLinked || !channelDetails.isLinkable ? Promise.resolve() : connectToFayeUser();
        }
    }

    return connectToFayeUser().then(() => {
        store.dispatch(AppStateActions.showChannelPage(channelType));
    });
}

export function hideChannelPage() {
    store.dispatch(AppStateActions.hideChannelPage());
}

export function showConnectNotification() {
    store.dispatch(AppStateActions.showConnectNotification(Date.now() / 1000.0));
}
