import { batchActions } from 'redux-batched-actions';

import { core } from './core';
import { setWeChatQRCode, setWeChatError, unsetWeChatError, setTwilioIntegrationState, resetTwilioIntegrationState, setViberQRCode, setViberError, unsetViberError } from '../actions/integrations-actions';
import { handleConversationUpdated } from './conversation';
import { getUserId } from './user';
import { updateUser } from '../actions/user-actions';

let fetchingWeChat = false;
let fetchingViber = false;

export function fetchWeChatQRCode() {
    return (dispatch, getState) => {
        const {integrations: {wechat}} = getState();

        if (wechat.qrCode || fetchingWeChat) {
            return Promise.resolve();
        }

        dispatch(unsetWeChatError());
        fetchingWeChat = true;
        return core(getState()).appUsers.wechat.getQRCode(getUserId(getState()))
            .then(({url}) => {
                dispatch(setWeChatQRCode(url));
            })
            .catch(() => {
                dispatch(setWeChatError());
            })
            .then(() => {
                fetchingWeChat = false;
            });
    };
}

export function updateTwilioAttributes(attr) {
    return (dispatch) => {
        dispatch(setTwilioIntegrationState(attr));
    };
}

export function resetTwilioAttributes() {
    return (dispatch) => {
        dispatch(resetTwilioIntegrationState());
    };
}

export function fetchTwilioAttributes() {
    return (dispatch, getState) => {
        const {user: {clients, pendingClients}} = getState();
        const client = clients.find((client) => client.platform === 'twilio');
        const pendingClient = pendingClients.find((client) => client.platform === 'twilio');

        if (client) {
            dispatch(updateTwilioAttributes({
                linkState: 'linked',
                appUserNumber: client.displayName
            }));
        } else if (pendingClient) {
            dispatch(updateTwilioAttributes({
                linkState: 'pending',
                appUserNumber: pendingClient.displayName
            }));
        }
    };
}

export function linkTwilioChannel(userId, data) {
    return (dispatch, getState) => {
        return core(getState()).appUsers.linkChannel(userId, data)
            .then(({appUser}) => {
                dispatch(updateUser(appUser));

                if (appUser.conversationStarted) {
                    return dispatch(handleConversationUpdated());
                }
            })
            .then(() => {
                dispatch(updateTwilioAttributes({
                    linkState: 'pending'
                }));
            })
            .catch((e) => {
                const {ui: {text: {smsTooManyRequestsError, smsTooManyRequestsOneMinuteError, smsBadRequestError, smsUnhandledError}}} = getState();

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

                dispatch(updateTwilioAttributes({
                    hasError: true,
                    errorMessage: errorMessage
                }));
            });
    };
}

export function unlinkTwilioChannel(userId) {
    return (dispatch, getState) => {
        return core(getState()).appUsers.unlinkChannel(userId, 'twilio')
            .then(() => {
                const {user: {clients, pendingClients}} = getState();
                dispatch(updateUser({
                    pendingClients: pendingClients.filter((pendingClient) => pendingClient.platform !== 'twilio'),
                    clients: clients.filter((client) => client.platform !== 'twilio')
                }));
            })
            .then(() => {
                dispatch(updateTwilioAttributes({
                    linkState: 'unlinked',
                    appUserNumber: '',
                    appUserNumberValid: false
                }));
            })
            .catch((e) => {
                const {response: {status}} = e;
                const {ui: {text: {smsBadRequestError}}} = getState();
                // Deleting a client that was never linked
                if (status === 400) {
                    dispatch(updateTwilioAttributes({
                        linkState: 'unlinked'
                    }));
                } else {
                    dispatch(updateTwilioAttributes({
                        linkState: 'unlinked',
                        hasError: true,
                        errorMessage: smsBadRequestError
                    }));
                }
            });
    };
}

export function pingTwilioChannel(userId) {
    return (dispatch, getState) => {
        return core(getState()).appUsers.pingChannel(userId, 'twilio')
            .then(() => {
                dispatch(updateTwilioAttributes({
                    linkState: 'linked'
                }));
            })
            .catch(() => {
                const {ui: {text: {smsPingChannelError}}} = getState();
                dispatch(updateTwilioAttributes({
                    hasError: true,
                    errorMessage: smsPingChannelError
                }));
            });
    };
}

export function cancelTwilioLink() {
    return (dispatch, getState) => {
        const {user: {pendingClients}, integrations: {twilio: {appUserNumber}}, ui: {text: {smsLinkCancelled}}} = getState();

        dispatch(batchActions([
            updateUser({
                pendingClients: pendingClients.filter((pendingClient) => pendingClient.platform !== 'twilio')
            }),
            updateTwilioAttributes({
                linkState: 'unlinked',
                hasError: true,
                errorMessage: smsLinkCancelled.replace('{appUserNumber}', appUserNumber)
            })
        ]));
    };
}

export function fetchViberQRCode() {
    return (dispatch, getState) => {
        const {integrations: {viber}} = getState();

        if (viber.qrCode || fetchingViber) {
            return Promise.resolve();
        }

        dispatch(unsetViberError());
        fetchingViber = true;
        return core(getState()).appUsers.viber.getQRCode(getUserId(getState()))
            .then(({url}) => {
                dispatch(setViberQRCode(url));
            })
            .catch(() => {
                dispatch(setViberError());
            })
            .then(() => {
                fetchingViber = false;
            });
    };
}
