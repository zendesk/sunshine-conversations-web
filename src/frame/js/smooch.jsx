import React from 'react';
import { render as reactRender, unmountComponentAtNode } from 'react-dom';
import pick from 'lodash.pick';
import { batchActions } from 'redux-batched-actions';
import { Provider } from 'react-redux';

import '../stylesheets/main.less';

import { store } from './store';

import { setAuth, resetAuth } from './actions/auth-actions';
import * as userActions from './actions/user-actions';
import { setStripeInfo, setApp } from './actions/app-actions';
import { updateText } from './actions/ui-actions';
import { setCurrentLocation } from './actions/browser-actions';
import { resetConversation } from './actions/conversation-actions';
import { resetIntegrations } from './actions/integrations-actions';
import * as AppStateActions from './actions/app-state-actions';
import { reset } from './actions/common-actions';
import { updateWidgetSize } from './actions/ui-actions';

import { openWidget, closeWidget, hideSettings, hideChannelPage } from './services/app';
import * as authService from './services/auth';
import { getAccount } from './services/stripe';
import * as userService from './services/user';
import { sendMessage as _sendMessage, disconnectFaye, handleConversationUpdated } from './services/conversation';
import { core } from './services/core';

import { observable, observeStore } from './utils/events';
import { waitForPage, monitorUrlChanges, stopMonitoringUrlChanges, monitorBrowserState, stopMonitoringBrowserState, updateHostClassNames } from './utils/dom';
import { isImageUploadSupported } from './utils/media';
import { playNotificationSound, isAudioSupported } from './utils/sound';
import { getDeviceId } from './utils/device';
import { getIntegration, hasChannels } from './utils/app';

import { VERSION } from '../../shared/js/constants/version';
import { WIDGET_STATE } from './constants/app';

import { Widget } from './components/widget';

let appToken;
let _container;
let lastTriggeredMessageTimestamp = 0;
let initialStoreChange = true;
let isInitialized = false;
let unsubscribeFromStore;

window.addEventListener('message', ({data, origin}) => {
    if (origin === `${location.protocol}//${location.host}`) {
        if (data.type === 'sizeChange') {
            store.dispatch(updateWidgetSize(data.value));
        }
    }
}, false);

function renderWidget(container) {
    if (container) {
        reactRender(<Provider store={ store }>
                        <Widget />
                    </Provider>, container);
        return container;
    } else {
        const el = document.createElement('div');
        el.setAttribute('id', 'sk-holder');
        reactRender(<Provider store={ store }>
                        <Widget />
                    </Provider>, el);

        waitForPage().then(() => {
            document.body.appendChild(el);
        });

        return el;
    }
}

observable.on('message:sent', (message) => {
    observable.trigger('message', message);
});
observable.on('message:received', (message) => {
    observable.trigger('message', message);
});

function handleNotificationSound() {
    const {appState: {soundNotificationEnabled}, browser: {hasFocus}} = store.getState();

    if (soundNotificationEnabled && !hasFocus) {
        playNotificationSound();
    }
}

function onStoreChange({conversation: {messages, unreadCount}, widgetState, displayStyle}) {
    if (messages.length > 0) {
        if (unreadCount > 0) {
            // only handle non-user messages
            const filteredMessages = messages.filter((message) => message.role !== 'appUser');
            filteredMessages.slice(-unreadCount).filter((message) => message.received > lastTriggeredMessageTimestamp).forEach((message) => {
                observable.trigger('message:received', message);
                lastTriggeredMessageTimestamp = message.received;

                if (initialStoreChange) {
                    initialStoreChange = false;
                } else {
                    handleNotificationSound();
                }
            });
        }
        observable.trigger('unreadCount', unreadCount);
    }

    updateHostClassNames(widgetState, displayStyle);
}

export function on(...args) {
    return observable.on(...args);
}

export function off(...args) {
    return observable.off(...args);
}

export function init(props) {
    isInitialized = true;

    props = {
        imageUploadEnabled: true,
        soundNotificationEnabled: true,
        ...props
    };

    appToken = props.appToken;

    const actions = [];

    if (props.emailCaptureEnabled) {
        actions.push(AppStateActions.enableEmailCapture());
    } else {
        actions.push(AppStateActions.disableEmailCapture());
    }

    if (props.soundNotificationEnabled && isAudioSupported()) {
        actions.push(AppStateActions.enableSoundNotification());
    } else {
        actions.push(AppStateActions.disableSoundNotification());
    }

    if (props.imageUploadEnabled && isImageUploadSupported()) {
        actions.push(AppStateActions.enableImageUpload());
    } else {
        actions.push(AppStateActions.disableImageUpload());
    }

    actions.push(AppStateActions.setEmbedded(!!props.embedded));

    if (props.customText) {
        actions.push(updateText(props.customText));
    }

    if (props.serviceUrl) {
        actions.push(AppStateActions.setServerURL(props.serviceUrl));
    }

    store.dispatch(batchActions(actions));

    unsubscribeFromStore = observeStore(store, ({conversation, appState: {widgetState}, app: {settings: {web: {displayStyle}}}}) => {
        return {
            conversation,
            widgetState,
            displayStyle
        };
    }, onStoreChange);

    monitorBrowserState(store.dispatch.bind(store));
    return login(props.userId, props.jwt, pick(props, userService.EDITABLE_PROPERTIES));
}

export function login(userId = '', jwt, attributes) {
    if (arguments.length === 2 && typeof jwt === 'object') {
        attributes = jwt;
        jwt = undefined;
    } else if (arguments.length < 3) {
        attributes = {};
    }

    const actions = [];
    // in case those are opened;
    actions.push(hideSettings());
    actions.push(hideChannelPage());

    // in case it comes from a previous authenticated state
    actions.push(resetAuth());
    actions.push(userActions.resetUser());
    actions.push(resetConversation());
    actions.push(resetIntegrations());


    attributes = pick(attributes, userService.EDITABLE_PROPERTIES);

    if (store.getState().appState.emailCaptureEnabled && attributes.email) {
        actions.push(AppStateActions.setEmailReadonly());
    } else {
        actions.push(AppStateActions.unsetEmailReadonly());
    }

    actions.push(setAuth({
        jwt: jwt,
        appToken
    }));

    store.dispatch(batchActions(actions));
    store.dispatch(disconnectFaye());

    lastTriggeredMessageTimestamp = 0;
    initialStoreChange = true;


    return store.dispatch(authService.login({
        userId: userId,
        device: {
            platform: 'web',
            id: getDeviceId(),
            info: {
                sdkVersion: VERSION,
                URL: document.location.host,
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                browserLanguage: navigator.language,
                currentUrl: document.location.href,
                currentTitle: document.title
            }
        }
    })).then((loginResponse) => {
        const actions = [];
        actions.push(userActions.setUser(loginResponse.appUser));
        actions.push(setApp(loginResponse.app));

        actions.push(setCurrentLocation(document.location));
        monitorUrlChanges(() => {
            const actions = [
                setCurrentLocation(document.location),
                userService.updateNowViewing(getDeviceId())
            ];

            store.dispatch(batchActions(actions));
        });

        if (hasChannels(loginResponse.app.settings.web)) {
            actions.push(AppStateActions.disableEmailCapture());
        }

        store.dispatch(batchActions(actions));

        if (getIntegration(loginResponse.app.integrations, 'stripeConnect')) {
            return store.dispatch(getAccount()).then((r) => {
                store.dispatch(setStripeInfo(r.account));
            }).catch(() => {
                // do nothing about it and let the flow continue
            });
        }
    }).then(() => {
        return store.dispatch(userService.immediateUpdate(attributes)).then(() => {
            const user = store.getState().user;
            if (user.conversationStarted) {
                return store.dispatch(handleConversationUpdated());
            }
        });
    }).then(() => {
        if (!store.getState().appState.embedded) {
            if (!_container) {
                _container = render();
            }
        }

        const user = store.getState().user;

        observable.trigger('ready', user);

        return user;
    });
}

export function logout() {
    return this.login();
}

export function track(eventName, userProps) {
    return store.dispatch(userService.trackEvent(eventName, userProps));
}

export function sendMessage(props) {
    return store.dispatch(_sendMessage(props));
}

export function updateUser(props) {
    return store.dispatch(userService.update(props)).then((response) => {
        if (response.appUser.conversationStarted) {
            return store.dispatch(handleConversationUpdated())
                .then(() => {
                    return response;
                });
        }

        return response;
    });
}

export function getConversation() {
    return store.dispatch(handleConversationUpdated())
        .then(() => {
            store.dispatch(userActions.updateUser({
                conversationStarted: true
            }));
            return store.getState().conversation;
        });
}

export function getUserId() {
    return userService.getUserId(store.getState());
}

export function getCore() {
    return core(store.getState());
}

export function destroy() {
    if (!isInitialized) {
        return;
    }
    isInitialized = false;

    stopMonitoringBrowserState();

    if (process.env.NODE_ENV !== 'test' && this._container) {
        unmountComponentAtNode(this._container);
    }

    const {embedded} = store.getState().appState;

    store.dispatch(disconnectFaye());
    const actions = [
        reset()
    ];

    if (embedded) {
        // retain the embed mode
        actions.push(AppStateActions.setEmbedded(true));
    } else if (this._container) {
        document.body.removeChild(this._container);
    }

    store.dispatch(batchActions(actions));

    stopMonitoringUrlChanges();
    unsubscribeFromStore();

    appToken = undefined;
    _container = undefined;
    observable.trigger('destroy');
    observable.off();
}

export function open() {
    store.dispatch(openWidget());
}

export function close() {
    store.dispatch(closeWidget());
}

export function isOpened() {
    return store.getState().appState.widgetState === WIDGET_STATE.OPENED;
}

export function render(container) {
    _container = container;
    return renderWidget(container);
}
