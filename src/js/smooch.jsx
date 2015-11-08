import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import uuid from 'uuid';

import { store } from './stores/app-store';
import { Widget } from './components/widget.jsx';

import { setAuth, resetAuth, setUser, resetUser } from './actions/auth-actions';
import { setConversation } from './actions/conversation-actions';
import { openWidget, closeWidget } from './actions/app-state-actions';

import { login } from './services/auth-service';
import { getConversation, sendMessage } from './services/conversation-service';

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

    if (document.readyState == "complete" || document.readyState == "loaded") {
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
    constructor() {}

    init(props) {
        this.appToken = props.appToken;
        return this.login(props.userId);
    }

    login(userId, jwt) {
        return Promise.resolve().then(()=> {
            store.dispatch(setAuth({
                jwt: jwt,
                appToken: this.appToken
            }));

            return login({
                userId: userId,
                device: {
                    platform: 'web',
                    id: getDeviceId()
                }
            });
        }).then((loginResponse) => {
            store.dispatch(setUser(loginResponse.appUser));

            if(loginResponse.appUser.conversationStarted) {
                return getConversation().then((conversationResponse) => {
                    store.dispatch(setConversation(conversationResponse.conversation));
                });
            }
        }).then(() => {
            if(!this._el) {
                this._el = renderWidget();
            }

            this.ready = true;
        });
    }

    logout() {
        store.dispatch(resetAuth());
        store.dispatch(resetUser());

        return this.login();
    }

    track() {
        return Promise.resolve()
    }

    sendMessage(text) {
        return sendMessage(text)
    }

    updateUser(props) {
        return Promise.resolve()
    }

    destroy() {
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
