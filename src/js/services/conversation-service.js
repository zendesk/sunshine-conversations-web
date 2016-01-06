import { store } from 'stores/app-store';
import { addMessage, setConversation } from 'actions/conversation-actions';
import { updateReadTimestamp as updateReadTimestampAction } from 'actions/app-state-actions';
import { setFayeSubscription, unsetFayeSubscription } from 'actions/faye-actions';
import { core } from 'services/core';
import { immediateUpdate } from 'services/user-service';
import { initFaye } from 'utils/faye';
import { storage } from 'utils/storage';

export function sendMessage(text) {
    var sendFn = () => {
        // add an id just to be able to reconcile the message
        // with the server response
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
        }).catch((e) => {
            console.log(e);
            throw e;
        });
    };

    var promise = immediateUpdate(store.getState().user);

    if (store.getState().user.conversationStarted) {
        return promise
            .then(() => {
                const fayeSubscription = store.getState().faye.subscription;
                if (!fayeSubscription) {
                    return getConversation()
                        .then(connectFaye)
                }
            })
            .then(sendFn);
    }

    // if it's not started, send the message first to create the conversation,
    // then get it and connect faye
    return promise
        .then(sendFn)
        .then(getConversation)
        .then(connectFaye);
}

export function getConversation() {
    const user = store.getState().user;
    return core().conversations.get(user._id).then((response) => {
        let conversationLength = response.conversation.messages.length;
        let lastMessage = conversationLength > 0 && response.conversation.messages[conversationLength - 1];
        if (lastMessage && lastMessage.role !== 'appUser' && getReadTimestamp() === 0) {
            updateReadTimestamp(lastMessage.received);
        }

        store.dispatch(setConversation(response.conversation));
        return response;
    }).catch((e) => {
        console.log(e)
        throw e;
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
