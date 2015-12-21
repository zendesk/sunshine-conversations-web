import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import _ from 'underscore';
import uuid from 'uuid';

import { store } from 'stores/app-store';
import { Widget } from 'components/widget.jsx';

import { setAuth, resetAuth } from 'actions/auth-actions';
import { setUser, resetUser } from 'actions/user-actions';
import { setConversation, resetConversation } from 'actions/conversation-actions';
import { openWidget, closeWidget } from 'actions/app-state-actions';
import { reset } from 'actions/common-actions';

import { login } from 'services/auth-service';
import { trackEvent, update as updateUser, immediateUpdate as immediateUpdateUser } from 'services/user-service';
import { getConversation, sendMessage, connectFaye, disconnectFaye } from 'services/conversation-service';

import { storage } from 'utils/storage';

function renderWidget() {
    const el = document.createElement('div');
    el.setAttribute('id', 'sk-holder');
    el.className = 'sk-noanimation';

    render(<Provider store={store}><Widget /></Provider>, el);

    const appendWidget = () => {
        document.body.appendChild(el);
        setTimeout(() => el.className = '', 200);
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

export const EDITABLE_PROPERTIES = [
    'givenName',
    'surname',
    'email',
    'signedUpAt',
    'properties'
];


export class Smooch {
    get VERSION() {
        return VERSION;
    }

    init(props) {
        this.appToken = props.appToken;

        // TODO : accept user attributes
        return this.login(props.userId, props.jwt, _.pick(props, EDITABLE_PROPERTIES));
    }

    login(userId = '', jwt, attributes) {
        if (arguments.length === 2 && typeof jwt === 'object') {
            attributes = jwt;
            jwt = undefined;
        } else if (arguments.length < 3) {
            attributes = {};
        }

        attributes = _.pick(attributes, EDITABLE_PROPERTIES);

        // TODO : accept user attributes
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
            return immediateUpdateUser(attributes).then((updateUserResponse) => {
                store.dispatch(setUser(updateUserResponse.appUser));
                const user = store.getState().user;

                if (user.conversationStarted) {
                    return getConversation().then((conversationResponse) => {
                        store.dispatch(setConversation(conversationResponse.conversation));
                        return connectFaye();
                    });
                }
            });
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
        store.dispatch(resetConversation());
        disconnectFaye();

        return this.login();
    }

    track(eventName, userProps) {
        return trackEvent(eventName, userProps).then((response) => {
            if (response.conversationUpdated) {
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

    sendMessage(text) {
        return connectFaye().then(() => {
            return immediateUpdateUser(store.getState().user).then(() => {
                return sendMessage(text);
            });
        });
    }

    updateUser(props) {
        // TODO : check if conversation started on server response
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
        });;
    }

    destroy() {
        disconnectFaye();
        store.dispatch(reset());

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
}
