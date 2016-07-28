import { store } from '../stores/app-store';
import { core } from './core';
import { setWeChatQRCode, setWeChatError, unsetWeChatError, setTwilioIntegrationState, resetTwilioIntegrationState } from '../actions/integrations-actions';
import { getUserId } from './user-service';
import { immediateUpdate } from './user-service';

let fetchingWeChat = false;

export function fetchWeChatQRCode() {
    const {integrations: {wechat}} = store.getState();

    if (wechat.qrCode || fetchingWeChat) {
        return Promise.resolve();
    }

    store.dispatch(unsetWeChatError());
    fetchingWeChat = true;
    return core().appUsers.wechat.getQRCode(getUserId())
        .then(({url}) => {
            store.dispatch(setWeChatQRCode(url));
        })
        .catch(() => {
            store.dispatch(setWeChatError());
        })
        .then(() => {
            fetchingWeChat = false;
        });
}

export function updateTwilioAttributes(attr) {
    store.dispatch(setTwilioIntegrationState(attr));
}

export function resetTwilioAttributes() {
    store.dispatch(resetTwilioIntegrationState());
}

export function fetchTwilioAttributes() {
    const {user: {clients, pendingClients}} = store.getState();
    const client = clients.find((client) => client.platform === 'twilio');
    const pendingClient = pendingClients && pendingClients.find((client) => client.platform === 'twilio');

    if (client) {
        updateTwilioAttributes({
            linkState: 'linked',
            appUserNumber: client.displayName
        });
    } else if (pendingClient) {
        updateTwilioAttributes({
            linkState: 'pending',
            appUserNumber: pendingClient.displayName
        });
    }
}

export function linkChannel(userId, data) {
    return core().appUsers.link.linkChannel(userId, data)
        .then((appUser) => {
            immediateUpdate(appUser).then(() => {
                updateTwilioAttributes({
                    linkState: 'pending'
                });
            });
        })
        .catch(() => {
            updateTwilioAttributes({
                hasError: true,
                errorMessage: 'Something went wrong. Please try again.'
            });
        });
}

export function deleteChannel(userId, data) {
    return core().appUsers.link.deleteChannel(userId, data)
        .then(() => {
            immediateUpdate({
                pendingClients: []
            }).then(() => {
                updateTwilioAttributes({
                    linkState: 'unlinked',
                    appUserNumber: '',
                    appUserNumberValid: false
                });
            });
        })
        .catch(() => {
            updateTwilioAttributes({
                hasError: true,
                errorMessage: 'Something went wrong. Please try again.'
            });
        });
}
