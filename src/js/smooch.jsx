import React from 'react';
import { render } from 'react-dom';
import uuid from 'uuid';
import pick from 'lodash.pick';

import { store } from 'stores/app-store';

import { setAuth, resetAuth } from 'actions/auth-actions';
import { setUser, resetUser } from 'actions/user-actions';
import { setPublicKeys } from 'actions/app-actions';
import { updateText } from 'actions/ui-actions';
import { setConversation, resetConversation } from 'actions/conversation-actions';
import { openWidget, closeWidget, showSettingsNotification, enableSettings, disableSettings, hideSettings, setServerURL, setEmailReadonly, unsetEmailReadonly, updateReadTimestamp } from 'actions/app-state-actions';
import { reset } from 'actions/common-actions';

import { login } from 'services/auth-service';
import { EDITABLE_PROPERTIES, trackEvent, update as updateUser, immediateUpdate as immediateUpdateUser } from 'services/user-service';
import { getConversation, sendMessage, connectFaye, disconnectFaye, getReadTimestamp } from 'services/conversation-service';

import { Observable, observeStore } from 'utils/events';
import { storage } from 'utils/storage';

function renderWidget() {
    const el = document.createElement('div');
    el.setAttribute('id', 'sk-holder');
    el.className = 'sk-noanimation';

    const Root = (process.env.NODE_ENV === 'production' ? require('./root-prod') : require('./root-dev')).Root;
    render(<Root store={ store } />, el);

    const appendWidget = () => {
        document.body.appendChild(el);
        setTimeout(() => el.className = '', 200);
    };

    if (document.readyState == 'complete' || document.readyState == 'loaded' || document.readyState == 'interactive') {
        appendWidget();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            appendWidget();
        });
    }

    return el;
}

function getDeviceId() {
    const SK_STORAGE = 'sk_deviceid';
    const deviceId = storage.getItem(SK_STORAGE) ||
        uuid.v4().replace(/-/g, '');

    storage.setItem(SK_STORAGE, deviceId);

    return deviceId;
}

let unsubscribeFromStore;

// timestamp of last triggered message
let lastTriggeredMessageTimestamp = 0;

// hide it outside of the instance, but it will be bound to it
// this keeps the API clean.
function onStoreChange(messages) {
    // if not set, fallback to the read timestamp, but it can be at 0 too if everything is already read
    // then just set it to the timestamp on the last message
    lastTriggeredMessageTimestamp = lastTriggeredMessageTimestamp || getReadTimestamp() || (messages.length > 0 && messages[messages.length - 1].received);

    messages.filter(message => message.received > lastTriggeredMessageTimestamp).forEach(message => {
        this.trigger('message', message);
        lastTriggeredMessageTimestamp = message.received;
    });
}

export class Smooch extends Observable {
    get VERSION() {
        return VERSION;
    }

    init(props) {
        this.appToken = props.appToken;

        if (props.emailCaptureEnabled) {
            store.dispatch(enableSettings());
        } else {
            store.dispatch(disableSettings());
        }

        if (props.customText) {
            store.dispatch(updateText(props.customText));
        }

        if (props.serviceUrl) {
            store.dispatch(setServerURL(props.serviceUrl));
        }

        unsubscribeFromStore = observeStore(store, state => state.conversation.messages, onStoreChange.bind(this));

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
        store.dispatch(resetUser());
        store.dispatch(resetConversation());
        disconnectFaye();

        attributes = pick(attributes, EDITABLE_PROPERTIES);

        if (store.getState().appState.settingsEnabled && attributes.email) {
            store.dispatch(setEmailReadonly());
        } else {
            store.dispatch(unsetEmailReadonly());
        }

        return Promise.resolve().then(() => {
            store.dispatch(setAuth({
                jwt: jwt,
                appToken: this.appToken
            }));

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
            });
        }).then((loginResponse) => {
            store.dispatch(setUser(loginResponse.appUser));
            store.dispatch(updateReadTimestamp(getReadTimestamp()));
            
            if (loginResponse.publicKeys) {
                store.dispatch(setPublicKeys(loginResponse.publicKeys));
            }

            return immediateUpdateUser(attributes).then(() => {
                const user = store.getState().user;
                if (user.conversationStarted) {
                    return getConversation().then(connectFaye);
                }
            });
        }).then(() => {
            if (!this._el) {
                this._el = renderWidget();
            }
            this.trigger('ready');
        });
    }

    logout() {
        lastTriggeredMessageTimestamp = 0;
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
                return getConversation().then((conversationResponse) => {
                    store.dispatch(setConversation(conversationResponse.conversation));
                    return connectFaye();
                }).then(() => {
                    return response;
                });
            }

            return response;
        });
    }

    destroy() {
        disconnectFaye();
        store.dispatch(reset());
        unsubscribeFromStore();
        lastTriggeredMessageTimestamp = 0;

        document.body.removeChild(this._el);
        delete this.appToken;
        delete this._el;
    }

    open() {
        store.dispatch(openWidget());
    }

    close() {
        store.dispatch(closeWidget());
    }

    showSettingsNotification() {
        store.dispatch(showSettingsNotification());
    }
}
