import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import uuid from 'uuid';

import { store } from './stores/app-store';
import { Widget } from './components/widget.jsx';

import { setAuth, resetAuth } from './actions/auth-actions';
import { setUser, resetUser } from './actions/user-actions';
import { setConversation } from './actions/conversation-actions';
import { openWidget, closeWidget } from './actions/app-state-actions';

import { login } from './services/auth-service';
import { trackEvent, update as updateUser } from './services/user-service';
import { getConversation, sendMessage, connectFaye, disconnectFaye } from './services/conversation-service';

import { storage } from './utils/storage';

function renderWidget() {
    const el = document.createElement('div');
    el.setAttribute('id', 'sk-holder');
    el.className = 'sk-noanimation';

    render(<Provider store={store}><Widget /></Provider>, el);

    const appendWidget = () => {
        document.body.appendChild(el);
        el.className = '';
    }

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


export class Smooch {
    static get VERSION() {
        return VERSION;
    }
    constructor() {}

    init(props) {
        this.appToken = props.appToken;
        return this.login(props.userId);
    }

    login(userId, jwt) {
        return Promise.resolve().then(() => {
            store.dispatch(setAuth({
                jwt: jwt,
                appToken: this.appToken
            }));

            // TODO : add more info on the device
            return login({
                userId: userId,
                device: {
                    platform: 'web',
                    id: getDeviceId()
                }
            });
        }).then((loginResponse) => {
            store.dispatch(setUser(loginResponse.appUser));
            const user = store.getState().user;

            if (user.conversationStarted) {
                return getConversation().then((conversationResponse) => {
                    store.dispatch(setConversation(conversationResponse.conversation));
                    return connectFaye();
                });
            }
        }).then(() => {
            if (!this._el) {
                this._el = renderWidget();
            }

            this.ready = true;
        });
    }

    logout() {
        store.dispatch(resetAuth());
        store.dispatch(resetUser());
        disconnectFaye();

        return this.login();
    }

    track(eventName, userProps) {
        return trackEvent(eventName, userProps);
    }

    sendMessage(text) {
        return sendMessage(text)
    }

    updateUser(props) {
        return updateUser(props);
    }

    destroy() {
        disconnectFaye();
        document.body.removeChild(this._el);
        delete this._el;
    }

    open() {
        store.dispatch(openWidget());
    }

    close() {
        store.dispatch(closeWidget());
    }
}
