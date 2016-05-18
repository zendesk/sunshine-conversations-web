import { store } from 'stores/app-store';
import { addMessage, removeMessage, setConversation, resetUnreadCount as resetUnreadCountAction } from 'actions/conversation-actions';
import { updateUser } from 'actions/user-actions';
import { showSettingsNotification, showErrorNotification } from 'actions/app-state-actions';
import { setFayeSubscription, unsetFayeSubscription } from 'actions/faye-actions';
import { core } from 'services/core';
import { immediateUpdate } from 'services/user-service';
import { initFaye } from 'utils/faye';
import { observable } from 'utils/events';
import { resizeImage, getBlobFromDataUrl, isFileTypeSupported } from 'utils/media';

export function handleFirstUserMessage(response) {
    const state = store.getState();
    if (state.appState.settingsEnabled && !state.user.email) {
        const appUserMessageCount = state.conversation.messages.filter((message) => message.role === 'appUser').length;

        if (appUserMessageCount === 1) {
            // should only be one message from the app user
            store.dispatch(showSettingsNotification());
        }
    }

    return response;
}

export function sendChain(sendFn) {
    const promise = immediateUpdate(store.getState().user);

    if (store.getState().user.conversationStarted) {
        return promise
            .then(connectFaye)
            .then(sendFn)
            .then(handleFirstUserMessage);
    }

    // if it's not started, send the message first to create the conversation,
    // then get it and connect faye
    return promise
        .then(sendFn)
        .then(handleFirstUserMessage)
        .then(connectFaye);
}

export function sendMessage(text) {
    return sendChain(() => {
        // add an id just to please React
        // this message will be replaced by the real one on the server response
        const message = {
            _id: Math.random(),
            role: 'appUser',
            text
        };

        store.dispatch(addMessage(message));

        const user = store.getState().user;

        return core().conversations.sendMessage(user._id, message).then((response) => {
            if (!user.conversationStarted) {
                store.dispatch(updateUser({
                    conversationStarted: true
                }));
            }

            store.dispatch(setConversation(response.conversation));
            observable.trigger('message:sent', response.message);
            return response;
        });
    });
}

export function uploadImage(file) {
    if (!isFileTypeSupported(file.type)) {
        store.dispatch(showErrorNotification(store.getState().ui.text.invalidFileError));
        return Promise.reject('Invalid file type');
    }

    return resizeImage(file).then((dataUrl) => {
        return sendChain(() => {
            // add an id just to please React
            // this message will be replaced by the real one on the server response
            const message = {
                mediaUrl: dataUrl,
                mediaType: 'image/jpeg',
                _id: Math.random(),
                role: 'appUser',
                status: 'sending'
            };

            store.dispatch(addMessage(message));

            const user = store.getState().user;
            const blob = getBlobFromDataUrl(dataUrl);

            return core().conversations.uploadImage(user._id, blob, {
                role: 'appUser'
            }).then((response) => {
                store.dispatch(setConversation(response.conversation));
                observable.trigger('message:sent', response.message);
                return response;
            }).catch(() => {
                store.dispatch(showErrorNotification(store.getState().ui.text.messageError));
                store.dispatch(removeMessage({
                    id: message._id
                }));

            });
        });
    }).catch(() => {
        store.dispatch(showErrorNotification(store.getState().ui.text.invalidFileError));
    });
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
    const {user, conversation} = store.getState();
    if (conversation.unreadCount > 0) {
        store.dispatch(resetUnreadCountAction());
        return core().conversations.resetUnreadCount(user._id).then((response) => {
            return response;
        });
    }

    return Promise.resolve();
}

export function handleConversationUpdated() {
    const subscription = store.getState().faye.subscription;

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

export function postPostback(actionId) {
    const {user} = store.getState();
    return core().conversations.postPostback(user._id, actionId).catch(() => {
        store.dispatch(showErrorNotification(store.getState().ui.text.actionPostbackError));
    });
}
