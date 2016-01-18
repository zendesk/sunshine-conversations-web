import { store } from 'stores/app-store';
import { addMessage, setConversation } from 'actions/conversation-actions';
import { updateReadTimestamp as updateReadTimestampAction, showSettingsNotification } from 'actions/app-state-actions';
import { setFayeSubscription, unsetFayeSubscription } from 'actions/faye-actions';
import { core } from 'services/core';
import { immediateUpdate } from 'services/user-service';
import { initFaye } from 'utils/faye';
import { storage } from 'utils/storage';

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

export function getReadTimestamp() {
    const user = store.getState().user;
    const storageKey = `sk_latestts_${user._id || 'anonymous'}`;
    let timestamp;
    try {
        timestamp = parseInt(storage.getItem(storageKey) || 0);
    }
    catch (e) {
        timestamp = 0;
    }
    return timestamp;
}

export function updateReadTimestamp(timestamp = Date.now()) {
    const user = store.getState().user;
    const storageKey = `sk_latestts_${user._id || 'anonymous'}`;

    storage.setItem(storageKey, timestamp);
    store.dispatch(updateReadTimestampAction(timestamp));
}

export function handleConversationUpdated() {
    let subscription = store.getState().faye.subscription;

    if (!subscription) {
        return getConversation()
            .then((response) => {
                return connectFaye().then(() => {
                    return response;
                });
            })
            .then((response) => {
                let conversationLength = response.conversation.messages.length;
                let lastMessage = conversationLength > 0 && response.conversation.messages[conversationLength - 1];
                if (lastMessage && lastMessage.role !== 'appUser' && getReadTimestamp() === 0) {
                    updateReadTimestamp(lastMessage.received);
                }

                return response;
            });
    }

    return Promise.resolve();
}
