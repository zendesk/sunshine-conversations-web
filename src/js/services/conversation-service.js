import { store } from '../stores/app-store';
import { messageAdded } from '../actions/conversation-actions';
import { core } from './core';

export function sendMessage(text) {
    const message = {
        text: text,
        role: 'appUser'
    };

    store.dispatch(messageAdded(message));

    const auth = store.getState().auth;
    const user = store.getState().user;

    // TODO :  reconcile sent message with data returned by the server
    return core().conversations.sendMessage(user._id, message, auth).catch((e) => console.log(e));
}

export function getConversation() {
    const auth = store.getState().auth;
    const user = store.getState().user;

    return core().conversations.get(user._id, auth).catch((e) => console.log(e));
}

export function connectFaye() {
    const conversation = store.getState().conversation;
}
