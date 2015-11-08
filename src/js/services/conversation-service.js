import { store } from '../stores/app-store';
import { messageAdded } from '../actions/conversation-actions';
import { core } from './core';

export function sendMessage(text) {
    const message = {
        text: text,
        role: 'appUser'
    };

    store.dispatch(messageAdded(message));

    const authState = store.getState().auth;

    // TODO :  reconcile sent message with data returned by the server
    return core.conversations.sendMessage(authState.user._id, message, authState.auth).catch((e) => console.log(e));
}

export function getConversation() {
    const authState = store.getState().auth;

    return core.conversations.get(authState.user._id, authState.auth).catch((e) => console.log(e));
}
