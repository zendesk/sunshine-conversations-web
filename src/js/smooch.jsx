import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import uuid from 'uuid';
import pick from 'lodash.pick';

import { store } from 'stores/app-store';

import { setAuth, resetAuth } from 'actions/auth-actions';
import * as userActions from 'actions/user-actions';
import { setPublicKeys, setStripeInfo, setAppSettings } from 'actions/app-actions';
import { updateText } from 'actions/ui-actions';
import { resetConversation } from 'actions/conversation-actions';
import * as AppStateActions from 'actions/app-state-actions';
import { reset } from 'actions/common-actions';

import { openWidget, closeWidget } from 'services/app-service';
import { login } from 'services/auth-service';
import { getAccount } from 'services/stripe-service';
import { EDITABLE_PROPERTIES, trackEvent, update as updateUser, updateNowViewing, immediateUpdate as immediateUpdateUser } from 'services/user-service';
import { getConversation, sendMessage, connectFaye, disconnectFaye, handleConversationUpdated } from 'services/conversation-service';

import { observable, observeStore } from 'utils/events';
import { storage } from 'utils/storage';
import { waitForPage, monitorUrlChanges, stopMonitoringUrlChanges, monitorBrowserState, stopMonitoringBrowserState } from 'utils/dom';
import { isImageUploadSupported } from 'utils/media';
import { playNotificationSound, isAudioSupported } from 'utils/sound';

import { Root } from './root';

function renderWidget(container) {
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

    render(<a href='https://smooch.io?utm_source=widget'>Messaging by smooch.io</a>, el);

    waitForPage().then(() => {
        document.body.appendChild(el);
        setTimeout(() => el.className = '', 200);
    });

    return el;
}

function getDeviceId() {
    const SK_STORAGE = 'sk_deviceid';
    const deviceId = storage.getItem(SK_STORAGE) ||
    uuid.v4().replace(/-/g, '');

    storage.setItem(SK_STORAGE, deviceId);

    return deviceId;
}

observable.on('message:sent', (message) => {
    observable.trigger('message', message);
});
observable.on('message:received', (message) => {
    observable.trigger('message', message);
});

let lastTriggeredMessageTimestamp = 0;
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
                handleNotificationSound();
            });
        }
    }
}

export class Smooch {
    get VERSION() {
        return VERSION;
    }

    on() {
        return observable.on(...arguments);
    }

    off() {
        return observable.off(...arguments);
    }

    init(props) {
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

        if (props.emailCaptureEnabled) {
            store.dispatch(AppStateActions.enableSettings());
        } else {
            store.dispatch(AppStateActions.disableSettings());
        }

        if (props.soundNotificationEnabled && isAudioSupported()) {
            store.dispatch(AppStateActions.enableSoundNotification());
        } else {
            store.dispatch(AppStateActions.disableSoundNotification());
        }

        if (props.imageUploadEnabled && isImageUploadSupported()) {
            store.dispatch(AppStateActions.enableImageUpload());
        } else {
            store.dispatch(AppStateActions.disableImageUpload());
        }

        store.dispatch(AppStateActions.setEmbedded(!!props.embedded));

        if (props.customText) {
            store.dispatch(updateText(props.customText));
        }

        if (props.serviceUrl) {
            store.dispatch(AppStateActions.setServerURL(props.serviceUrl));
        }
        unsubscribeFromStore = observeStore(store, ({conversation}) => conversation, onStoreChange);

        monitorBrowserState();
        return this.login(props.userId, props.jwt, pick(props, EDITABLE_PROPERTIES));
    }

    login(userId = '', jwt, attributes) {
        if (arguments.length === 2 && typeof jwt === 'object') {
            attributes = jwt;
            jwt = undefined;
        } else if (arguments.length < 3) {
            attributes = {};
        }

        // in case it comes from a previous authenticated state
        store.dispatch(resetAuth());
        store.dispatch(userActions.resetUser());
        store.dispatch(resetConversation());

        disconnectFaye();

        attributes = pick(attributes, EDITABLE_PROPERTIES);

        if (store.getState().appState.settingsEnabled && attributes.email) {
            store.dispatch(AppStateActions.setEmailReadonly());
        } else {
            store.dispatch(AppStateActions.unsetEmailReadonly());
        }

        store.dispatch(setAuth({
            jwt: jwt,
            appToken: this.appToken
        }));

        lastTriggeredMessageTimestamp = 0;
        return login({
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
        }).then((loginResponse) => {
            store.dispatch(userActions.setUser(loginResponse.appUser));
            store.dispatch(setAppSettings(loginResponse.app.settings));

            monitorUrlChanges(() => {
                updateNowViewing(getDeviceId());
            });

            if (loginResponse.publicKeys) {
                store.dispatch(setPublicKeys(loginResponse.publicKeys));

                if (loginResponse.publicKeys.stripe) {
                    return getAccount().then((r) => {
                        store.dispatch(setStripeInfo(r.account));
                    }).catch(() => {
                        // do nothing about it and let the flow continue
                    });
                }
            }
        }).then(() => {
            return immediateUpdateUser(attributes).then(() => {
                const user = store.getState().user;
                if (user.conversationStarted) {
                    return getConversation().then(connectFaye);
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
        return trackEvent(eventName, userProps);
    }

    sendMessage(text) {
        return sendMessage(text);
    }

    updateUser(props) {
        return updateUser(props).then((response) => {
            if (response.appUser.conversationStarted) {
                return handleConversationUpdated().then(() => {
                    return response;
                });
            }

            return response;
        });
    }

    getConversation() {
        return handleConversationUpdated().then(() => {
            store.dispatch(userActions.updateUser({
                conversationStarted: true
            }));
            return store.getState().conversation;
        });
    }

    destroy() {
        if (!this.appToken) {
            console.warn('Smooch.destroy was called before Smooch.init was called properly.');
        }

        const {embedded} = store.getState().appState;
        disconnectFaye();
        store.dispatch(reset());
        if (process.env.NODE_ENV !== 'test' && this._container) {
            unmountComponentAtNode(this._container);
        }

        if (embedded) {
            // retain the embed mode
            store.dispatch(AppStateActions.setEmbedded(true));
        } else if (this._container) {
            document.body.removeChild(this._container);
        }

        stopMonitoringUrlChanges();
        stopMonitoringBrowserState();
        unsubscribeFromStore();

        delete this.appToken;
        delete this._container;
        observable.trigger('destroy');
        observable.off();
    }

    open() {
        openWidget();
    }

    close() {
        closeWidget();
    }

    isOpened() {
        return !!store.getState().appState.widgetOpened;
    }

    render(container) {
        this._container = container;
        return renderWidget(container);
    }
}
