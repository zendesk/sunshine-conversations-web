import React from 'react';
import { render as reactRender } from 'react-dom';
import pick from 'lodash.pick';
import { batchActions } from 'redux-batched-actions';
import { Provider } from 'react-redux';
import Raven from 'raven-js';

import '../stylesheets/main.less';

import { store } from './store';

import * as authActions from './actions/auth';
import * as userActions from './actions/user';
import { updateText } from './actions/ui';
import { setCurrentLocation } from './actions/browser';
import { sendMessage as _sendMessage, disconnectFaye, handleConversationUpdated, resetConversation, startConversation } from './actions/conversation';
import { resetIntegrations } from './actions/integrations';
import * as appStateActions from './actions/app-state';
import { getAccount } from './actions/stripe';
import { setConfig, fetchConfig } from './actions/config';

import { core } from './utils/core';
import { observable, observeStore } from './utils/events';
import { waitForPage, monitorUrlChanges, stopMonitoringUrlChanges, monitorBrowserState, stopMonitoringBrowserState, updateHostClassNames } from './utils/dom';
import { isImageUploadSupported } from './utils/media';
import { playNotificationSound, isAudioSupported } from './utils/sound';
import { getDeviceId } from './utils/device';
import storage from './utils/storage';
import { getIntegration } from './utils/app';

import { WIDGET_STATE } from './constants/app';

import Widget from './components/Widget';

let lastTriggeredMessageTimestamp = 0;
let initialStoreChange = true;
let isInitialized = false;
let unsubscribeFromStore;

// Listen for media query changes from the host page.
window.addEventListener('message', ({data, origin}) => {
    if (origin === `${parent.document.location.protocol}//${parent.document.location.host}`) {
        if (data.type === 'sizeChange') {
            store.dispatch(appStateActions.updateWidgetSize(data.value));
        }
    }
}, false);

function renderWidget() {
    waitForPage().then(() => {
        const mount = document.querySelector('#mount');
        reactRender(<Provider store={ store }>
                        <Widget />
                    </Provider>, mount);
    });
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

    if (displayStyle) {
        updateHostClassNames(widgetState, displayStyle);
    }
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

    if (!props.appId) {
        return Promise.reject(new Error('Must provide an appId'));
    }

    Raven.setExtraContext({
        appId: props.appId
    });

    const actions = [
        setConfig('appId', props.appId),
        setConfig('soundNotificationEnabled', props.soundNotificationEnabled && isAudioSupported()),
        setConfig('imageUploadEnabled', props.imageUploadEnabled && isImageUploadSupported()),
        appStateActions.setEmbedded(!!props.embedded),
        setConfig('configBaseUrl', props.configBaseUrl || `https://${props.appId}.config.smooch.io`)
    ];

    if (props.customText) {
        actions.push(updateText(props.customText));
    }

    store.dispatch(batchActions(actions));

    unsubscribeFromStore = observeStore(store, ({conversation, appState: {widgetState}, config: {style}}) => {
        return {
            conversation,
            widgetState,
            displayStyle: style && style.displayStyle
        };
    }, onStoreChange);

    monitorBrowserState(store.dispatch.bind(store));

    return store.dispatch(fetchConfig())
        .then(() => {
            if (props.userId && props.jwt) {
                return login(props.userId, props.jwt);
            }
        })
        .then(() => {
            if (!props.embedded) {
                render();
            }

            observable.trigger('ready');
        })
        .then(() => {
            store.dispatch(startConversation());
        });
}

export function login(userId, jwt) {
    if (!userId || !jwt) {
        throw new Error('Must provide a userId and a jwt to log in.');
    }

    const sessionToken = storage.getItem('sessionToken');
    const smoochId = storage.getItem('smoochId');

    const actions = [
        authActions.setAuth({
            jwt,
            userId,
            sessionToken
        }),
        userActions.setUser({
            _id: smoochId,
            userId
        })
    ];

    store.dispatch(batchActions(actions));
    store.dispatch(disconnectFaye());

    lastTriggeredMessageTimestamp = 0;
    initialStoreChange = true;

    return store.dispatch(authActions.login({
        userId: userId,
        sessionToken,
        device: {
            platform: 'web',
            id: getDeviceId(),
            info: {
                sdkVersion: VERSION,
                URL: parent.document.location.host,
                userAgent: navigator.userAgent,
                referrer: parent.document.referrer,
                browserLanguage: navigator.language,
                currentUrl: parent.document.location.href,
                currentTitle: parent.document.title
            }
        }
    })).then((loginResponse) => {
        console.log(loginResponse);
        Raven.setUserContext({
            id: loginResponse.appUser.userId || loginResponse.appUser._id
        });

        const actions = [];
        actions.push(userActions.setUser(loginResponse.appUser));
        // actions.push(setApp(loginResponse.app));

        actions.push(setCurrentLocation(parent.document.location));
        monitorUrlChanges(() => {
            const actions = [
                setCurrentLocation(parent.document.location),
                userActions.updateNowViewing(getDeviceId())
            ];

            store.dispatch(batchActions(actions));
        });

        store.dispatch(batchActions(actions));

    // if (getIntegration(loginResponse.app.integrations, 'stripeConnect')) {
    //     return store.dispatch(getAccount()).then((r) => {
    //         // store.dispatch(setStripeInfo(r.account));
    //     }).catch(() => {
    //         // do nothing about it and let the flow continue
    //     });
    // }
    }).then(() => {
        return store.dispatch(userActions.immediateUpdate(attributes)).then(() => {
            const user = store.getState().user;
            if (user.conversationStarted) {
                return store.dispatch(handleConversationUpdated());
            }
        });
    });
}

export function logout() {
    return login();
}

export function sendMessage(props) {
    return store.dispatch(_sendMessage(props));
}

export function updateUser(props) {
    return store.dispatch(userActions.update(props)).then((response) => {
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
    return userActions.getUserId(store.getState());
}

export function getCore() {
    return core(store.getState());
}

export function destroy() {
    // `destroy()` only need to clean up handlers
    // the rest will be cleaned up with the iframe removal

    if (!isInitialized) {
        return;
    }

    stopMonitoringBrowserState();
    stopMonitoringUrlChanges();
    unsubscribeFromStore();

    store.dispatch(disconnectFaye());
    observable.trigger('destroy');
    observable.off();
}

export function open() {
    store.dispatch(appStateActions.openWidget());
}

export function close() {
    store.dispatch(appStateActions.closeWidget());
}

export function isOpened() {
    return store.getState().appState.widgetState === WIDGET_STATE.OPENED;
}

export function render() {
    return renderWidget();
}
