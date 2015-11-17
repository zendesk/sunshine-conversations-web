import { store } from '../stores/app-store';
import { messageAdded } from '../actions/conversation-actions';
import { setFayeSubscription, unsetFayeSubscription } from '../actions/faye-actions';
import { core } from './core';
import { initFaye } from '../utils/faye';

export function sendMessage(text) {
    const message = {
        text: text,
        role: 'appUser'
    };

    store.dispatch(messageAdded(message));

    const user = store.getState().user;

    // TODO :  reconcile sent message with data returned by the server
    return core().conversations.sendMessage(user._id, message).catch((e) => console.log(e));
}

export function getConversation() {
    const user = store.getState().user;

    return core().conversations.get(user._id).catch((e) => console.log(e));
}

export function connectFaye() {
    const subscription = initFaye();
    store.dispatch(setFayeSubscription(subscription));

    return subscription;
}

export function disconnectFaye() {
    const subscription = store.getState().faye.subscription;
    if (subscription) {
        subscription.cancel();
        store.dispatch(unsetFayeSubscription());
    }
}
