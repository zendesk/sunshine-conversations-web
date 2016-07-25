import { store } from '../stores/app-store';
import { core } from './core';
import { setWeChatQRCode, setWeChatError, unsetWeChatError, setTwilioIntegrationState, resetTwilioIntegrationState } from '../actions/integrations-actions';
import { getUserId } from './user-service';

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
    const {user: {clients}} = store.getState();
    const client = clients.find((client) => client.platform === 'twilio');

    if (client) {
        updateTwilioAttributes({
            linkState: 'linked',
            number: client.info.phoneNumber
        });
    }
}
