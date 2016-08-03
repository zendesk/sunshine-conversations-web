import { store } from '../stores/app-store';
import { core } from './core';
import { setWeChatQRCode, setWeChatError, unsetWeChatError, setTwilioIntegrationState, resetTwilioIntegrationState } from '../actions/integrations-actions';
import { getUserId } from './user-service';
import { updateUser } from '../actions/user-actions';

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
    const pendingClient = pendingClients.find((client) => client.platform === 'twilio');

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

export function linkTwilioChannel(userId, data) {
    return core().appUsers.linkChannel(userId, data)
        .then(({appUser}) => {
            store.dispatch(updateUser(appUser));
        })
        .then(() => {
            updateTwilioAttributes({
                linkState: 'pending'
            });
        })
        .catch((e) => {
            const {response: {status}} = e;
            let errorMessage;
            if (status === 429) {
                errorMessage = 'A link was attempted recently for this phone number. Please wait before trying again.';
            } else {
                errorMessage = 'We were unable to communicate with this number. Please enter a different one.';
            }
            updateTwilioAttributes({
                hasError: true,
                errorMessage: errorMessage
            });
        });
}

export function unlinkTwilioChannel(userId) {
    return core().appUsers.unlinkChannel(userId, 'twilio')
        .then(() => {
            const {user: {clients, pendingClients}} = store.getState();
            store.dispatch(updateUser({
                pendingClients: pendingClients.filter((pendingClient) => pendingClient.platform !== 'twilio'),
                clients: clients.filter((client) => client.platform !== 'twilio')
            }));
        })
        .then(() => {
            updateTwilioAttributes({
                linkState: 'unlinked',
                appUserNumber: '',
                appUserNumberValid: false
            });
        })
        .catch((e) => {
            const {response: {status}} = e;
            const {ui: {text: {smsBadRequestError}}} = store.getState();
            // Deleting a client that was never linked
            if (status === 400) {
                updateTwilioAttributes({
                    linkState: 'unlinked'
                });
            } else {
                updateTwilioAttributes({
                    linkState: 'unlinked',
                    hasError: true,
                    errorMessage: smsBadRequestError
                });
            }
        });
}

export function pingTwilioChannel(userId) {
    return core().appUsers.pingChannel(userId, 'twilio')
        .then(() => {
            updateTwilioAttributes({
                linkState: 'linked'
            });
        })
        .catch(() => {
            updateTwilioAttributes({
                hasError: true,
                errorMessage: 'There was an error sending a message to your number.'
            });
        });
}
