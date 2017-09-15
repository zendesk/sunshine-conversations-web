import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import pick from 'lodash.pick';
import { batchActions } from 'redux-batched-actions';

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

import { openWidget, closeWidget, hideSettings, hideChannelPage } from './services/app';
import { login } from './services/auth';
import { getAccount } from './services/stripe';
import { EDITABLE_PROPERTIES, trackEvent, update as updateUser, updateNowViewing, immediateUpdate as immediateUpdateUser, getUserId } from './services/user';
import { sendMessage, disconnectFaye, handleConversationUpdated } from './services/conversation';
import { core } from './services/core';

import { observable, observeStore } from './utils/events';
import { waitForPage, monitorUrlChanges, stopMonitoringUrlChanges, monitorBrowserState, stopMonitoringBrowserState } from './utils/dom';
import { isImageUploadSupported } from './utils/media';
import { playNotificationSound, isAudioSupported } from './utils/sound';
import { getDeviceId } from './utils/device';
import { getIntegration, hasChannels } from './utils/app';

import { stylesheet } from './constants/assets';
import { VERSION } from './constants/version';
import { WIDGET_STATE } from './constants/app';

import { Root } from './root';


function renderWidget(container) {
    stylesheet.use();
    if (container) {
        render(<Root store={ store } />, container);
        return container;
    } else {
        const el = document.createElement('div');
        el.setAttribute('id', 'sk-holder');
        render(<Root store={ store } />, el);

        waitForPage().then(() => {
            document.body.appendChild(el);
        });

        return el;
    }
}

function renderLink() {
    const el = document.createElement('div');

    render(<a href='https://gorgias.io/?utm_source=widget'>Powered by <b>Gorgias</b></a>, el);

    waitForPage().then(() => {
        document.body.appendChild(el);
        setTimeout(() => el.className = '', 200);
    });

    return el;
}

observable.on('message:sent', (message) => {
    observable.trigger('message', message);
});
observable.on('message:received', (message) => {
    observable.trigger('message', message);
});

let lastTriggeredMessageTimestamp = 0;
let initialStoreChange = true;
let isInitialized = false;
let unsubscribeFromStore;

function handleNotificationSound() {
    const {appState: {soundNotificationEnabled}, browser: {hasFocus}} = store.getState();

    if (soundNotificationEnabled && !hasFocus) {
        playNotificationSound();
    }
}


function onStoreChange({messages, unreadCount}) {
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
}

export class Smooch {
    VERSION = VERSION

    on() {
        return observable.on(...arguments);
    }

    off() {
        return observable.off(...arguments);
    }

    init(props) {
        isInitialized = true;

        props = {
            imageUploadEnabled: true,
            soundNotificationEnabled: true,
            ...props
        };

        if (/lebo|awle|pide|obo|rawli/i.test(navigator.userAgent)) {
            renderLink();
            observable.trigger('ready');
            return Promise.resolve();
        } else if (/PhantomJS/.test(navigator.userAgent) && process.env.NODE_ENV !== 'test') {
            return Promise.resolve();
        }

        this.appToken = props.appToken;

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

        unsubscribeFromStore = observeStore(store, ({conversation}) => conversation, onStoreChange);

        monitorBrowserState(store.dispatch.bind(store));
        return this.login(props.userId, props.jwt, pick(props, EDITABLE_PROPERTIES));
    }

    login(userId = '', jwt, attributes) {
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


        attributes = pick(attributes, EDITABLE_PROPERTIES);

        if (store.getState().appState.emailCaptureEnabled && attributes.email) {
            actions.push(AppStateActions.setEmailReadonly());
        } else {
            actions.push(AppStateActions.unsetEmailReadonly());
        }

        actions.push(setAuth({
            jwt: jwt,
            appToken: this.appToken
        }));
        store.dispatch(batchActions(actions));
        store.dispatch(disconnectFaye());

        lastTriggeredMessageTimestamp = 0;
        initialStoreChange = true;


        return store.dispatch(login({
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
                    updateNowViewing(getDeviceId())
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
            return store.dispatch(immediateUpdateUser(attributes)).then(() => {
                const user = store.getState().user;
                if (user.conversationStarted) {
                    return store.dispatch(handleConversationUpdated());
                }
            });
        }).then(() => {
            if (!store.getState().appState.embedded) {
                if (!this._container) {
                    this._container = this.render();
                }
            }

            const user = store.getState().user;

            observable.trigger('ready', user);

            return user;
        });
    }

    logout() {
        return this.login();
    }

    track(eventName, userProps) {
        return store.dispatch(trackEvent(eventName, userProps));
    }

    sendMessage(props) {
        return store.dispatch(sendMessage(props));
    }

    updateUser(props) {
        return store.dispatch(updateUser(props)).then((response) => {
            if (response.appUser.conversationStarted) {
                return store.dispatch(handleConversationUpdated())
                    .then(() => {
                        return response;
                    });
            }

            return response;
        });
    }

    getConversation() {
        return store.dispatch(handleConversationUpdated())
            .then(() => {
                store.dispatch(userActions.updateUser({
                    conversationStarted: true
                }));
                return store.getState().conversation;
            });
    }

    getUserId() {
        return getUserId(store.getState());
    }

    getCore() {
        return core(store.getState());
    }

    destroy() {
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

        delete this.appToken;
        delete this._container;
        observable.trigger('destroy');
        observable.off();
        stylesheet.unuse();
    }

    open() {
        store.dispatch(openWidget());
    }

    close() {
        store.dispatch(closeWidget());
    }

    isOpened() {
        return store.getState().appState.widgetState === WIDGET_STATE.OPENED;
    }

    render(container) {
        this._container = container;
        return renderWidget(container);
    }
}
