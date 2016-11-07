import { store } from '../stores/app-store';
import { core } from './core';
import { setWeChatQRCode, setWeChatError, unsetWeChatError, setTwilioIntegrationState, resetTwilioIntegrationState, setViberQRCode, setViberError, unsetViberError } from '../actions/integrations-actions';
import { handleConversationUpdated } from './conversation-service';
import { getUserId } from './user-service';
import { updateUser } from '../actions/user-actions';

let fetchingWeChat = false;
let fetchingViber = false;

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

            if (appUser.conversationStarted) {
                return handleConversationUpdated();
            }
        })
        .then(() => {
            updateTwilioAttributes({
                linkState: 'pending'
            });
        })
        .catch((e) => {
            const {ui: {text: {smsTooManyRequestsError, smsTooManyRequestsOneMinuteError, smsBadRequestError, smsUnhandledError}}} = store.getState();

            const {response: {status}} = e;
            let errorMessage;

            if (status === 429) {
                const minutes = Math.ceil(e.response.headers.get('retry-after') / 60);
                if (minutes > 1) {
                    errorMessage = smsTooManyRequestsError.replace('{minutes}', minutes);
                } else {
                    errorMessage = smsTooManyRequestsOneMinuteError;
                }
            } else if (status > 499) {
                errorMessage = smsUnhandledError;
            } else {
                errorMessage = smsBadRequestError;
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
            const {ui: {text: {smsPingChannelError}}} = store.getState();
            updateTwilioAttributes({
                hasError: true,
                errorMessage: smsPingChannelError
            });
        });
}

export function cancelTwilioLink() {
    const {user: {pendingClients}, integrations: {twilio: {appUserNumber}}, ui: {text: {smsLinkCancelled}}} = store.getState();

    store.dispatch(updateUser({
        pendingClients: pendingClients.filter((pendingClient) => pendingClient.platform !== 'twilio')
    }));

    updateTwilioAttributes({
        linkState: 'unlinked',
        hasError: true,
        errorMessage: smsLinkCancelled.replace('{appUserNumber}', appUserNumber)
    });
}

export function fetchViberQRCode() {
    const {integrations: {viber}} = store.getState();

    if (viber.qrCode || fetchingViber) {
        return Promise.resolve();
    }

    store.dispatch(unsetViberError());
    fetchingViber = true;
    return core().appUsers.viber.getQRCode(getUserId())
        .then(({url}) => {
            store.dispatch(setViberQRCode(url));
        })
        .catch(() => {
            store.dispatch(setViberError());
        })
        .then(() => {
            fetchingViber = false;
        });
}
