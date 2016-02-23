import { store } from 'stores/app-store';
import { addMessage, setConversation, resetUnreadCount as resetUnreadCountAction } from 'actions/conversation-actions';
import { showSettingsNotification } from 'actions/app-state-actions';
import { setFayeSubscription, unsetFayeSubscription } from 'actions/faye-actions';
import { core } from 'services/core';
import { immediateUpdate } from 'services/user-service';
import { initFaye } from 'utils/faye';
import { storage } from 'utils/storage';
import { observable } from 'utils/events';

export function handleFirstUserMessage(response) {
    let state = store.getState();
    if (state.appState.settingsEnabled && !state.user.email) {
        let appUserMessageCount = state.conversation.messages.filter(message => message.role === 'appUser').length;

        if (appUserMessageCount === 1) {
            // should only be one message from the app user
            store.dispatch(showSettingsNotification());
        }
    }

    return response;
}

export function sendMessage(text) {
    var sendFn = () => {
        // add an id just to please React
        // this message will be replaced by the real one on the server response
        const message = {
            _id: Math.random(),
            text: text,
            role: 'appUser'
        };

        store.dispatch(addMessage(message));

        const user = store.getState().user;

        return core().conversations.sendMessage(user._id, message).then((response) => {
            store.dispatch(setConversation(response.conversation));
            observable.trigger('message:sent', response.message);
            return response;
        }).then(handleFirstUserMessage);
    };

    var promise = immediateUpdate(store.getState().user);

    if (store.getState().user.conversationStarted) {
        return promise
            .then(connectFaye)
            .then(sendFn);
    }

    // if it's not started, send the message first to create the conversation,
    // then get it and connect faye
    return promise
        .then(sendFn)
        .then(connectFaye);
}

export function getConversation() {
    const user = store.getState().user;
    return core().conversations.get(user._id).then((response) => {
        store.dispatch(setConversation(response.conversation));
        return response;
    });
}

export function connectFaye() {
    let subscription = store.getState().faye.subscription;
    if (!subscription) {
        subscription = initFaye();
        store.dispatch(setFayeSubscription(subscription));
        return subscription.then(getConversation);
    }

    return subscription;
}

export function disconnectFaye() {
    const subscription = store.getState().faye.subscription;
    if (subscription) {
        subscription.cancel();
        store.dispatch(unsetFayeSubscription());
    }
}

export function resetUnreadCount() {
    const user = store.getState().user;
    return core().conversations.resetUnreadCount(user._id).then((response) => {
        store.dispatch(resetUnreadCountAction());
        return response;
    });
}

export function handleConversationUpdated() {
    let subscription = store.getState().faye.subscription;

    if (!subscription) {
        return getConversation()
            .then((response) => {
                return connectFaye().then(() => {
                    return response;
                });
            });
    }

    return Promise.resolve();
}
