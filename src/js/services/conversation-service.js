import { store } from '../stores/app-store';
import { showConnectNotification } from '../services/app-service';
import { addMessage, addMessages, replaceMessage, removeMessage, setConversation, resetUnreadCount as resetUnreadCountAction, setMessages, setFetchingMoreMessagesFromServer } from '../actions/conversation-actions';
import { updateUser } from '../actions/user-actions';
import { showErrorNotification, setShouldScrollToBottom, setFetchingMoreMessages as setFetchingMoreMessagesUi } from '../actions/app-state-actions';
import { unsetFayeSubscriptions } from '../actions/faye-actions';
import { core } from './core';
import { immediateUpdate } from './user-service';
import { disconnectClient, subscribeConversation, subscribeUser } from '../utils/faye';
import { observable } from '../utils/events';
import { resizeImage, getBlobFromDataUrl, isFileTypeSupported } from '../utils/media';
import { getDeviceId } from '../utils/device';
import { hasLinkableChannels, getLinkableChannels, isChannelLinked } from '../utils/user';
import { CONNECT_NOTIFICATION_DELAY_IN_SECONDS } from '../constants/notifications';
import { getUserId } from './user-service';

export function handleConnectNotification(response) {
    const {user: {clients, email}, app: {integrations, settings}, conversation: {messages}, appState: {emailCaptureEnabled}} = store.getState();
    const appUserMessages = messages.filter((message) => message.role === 'appUser');

    const channelsAvailable = hasLinkableChannels(integrations, clients, settings.web);
    const showEmailCapture = emailCaptureEnabled && !email;
    const hasSomeChannelLinked = getLinkableChannels(integrations, settings.web).some((channelType) => {
        return isChannelLinked(clients, channelType);
    });

    if ((showEmailCapture || channelsAvailable) && !hasSomeChannelLinked) {
        if (appUserMessages.length === 1) {
            showConnectNotification();
        } else {
            // find the last confirmed message timestamp
            let lastMessageTimestamp;

            // start at -2 to ignore the message that was just sent
            for (let index = appUserMessages.length - 2; index >= 0 && !lastMessageTimestamp; index--) {
                const message = appUserMessages[index];
                lastMessageTimestamp = message.received;
            }

            if (lastMessageTimestamp) {
                // divide it by 1000 since server `received` is in seconds and not in ms
                const currentTimeStamp = Date.now() / 1000;
                if ((currentTimeStamp - lastMessageTimestamp) >= CONNECT_NOTIFICATION_DELAY_IN_SECONDS) {
                    showConnectNotification();
                }
            }
        }
    }

    return response;
}

export function sendChain(sendFn) {
    const promise = immediateUpdate(store.getState().user);

    const enableScrollToBottom = (response) => {
        store.dispatch(setShouldScrollToBottom(true));
        return response;
    };

    if (store.getState().user.conversationStarted) {
        return promise
            .then(connectFayeConversation)
            .then(sendFn)
            .then(enableScrollToBottom)
            .then(handleConnectNotification);
    }

    // if it's not started, send the message first to create the conversation,
    // then get it and connect faye
    return promise
        .then(sendFn)
        .then(enableScrollToBottom)
        .then(handleConnectNotification)
        .then(connectFayeConversation);
}

export function sendMessage(text, extra = {}) {
    return sendChain(() => {
        const message = {
            role: 'appUser',
            text,
            _clientId: Math.random(),
            _clientSent: new Date(),
            deviceId: getDeviceId(),
            ...extra
        };

        store.dispatch(setShouldScrollToBottom(true));
        store.dispatch(addMessage(message));

        const {user} = store.getState();

        return core().appUsers.sendMessage(getUserId(), message).then((response) => {
            if (!user.conversationStarted) {
                // use setConversation to set the conversation id in the store
                store.dispatch(setConversation(response.conversation));
                store.dispatch(updateUser({
                    conversationStarted: true
                }));
            }
            store.dispatch(replaceMessage({
                _clientId: message._clientId
            }, response.message));

            observable.trigger('message:sent', response.message);
            return response;
        }).catch(() => {
            store.dispatch(showErrorNotification(store.getState().ui.text.messageError));
            store.dispatch(removeMessage({
                _clientId: message._clientId
            }));

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
            const message = {
                mediaUrl: dataUrl,
                mediaType: 'image/jpeg',
                role: 'appUser',
                status: 'sending',
                _clientId: Math.random(),
                _clientSent: new Date()
            };

            store.dispatch(addMessage(message));

            const {user} = store.getState();
            const blob = getBlobFromDataUrl(dataUrl);

            return core().appUsers.uploadImage(getUserId(), blob, {
                role: 'appUser',
                deviceId: getDeviceId()
            }).then((response) => {
                if (!user.conversationStarted) {
                    // use setConversation to set the conversation id in the store
                    store.dispatch(setConversation(response.conversation));
                    store.dispatch(updateUser({
                        conversationStarted: true
                    }));
                }
                store.dispatch(replaceMessage({
                    _clientId: message._clientId
                }, response.message));

                observable.trigger('message:sent', response.message);
                return response;
            }).catch(() => {
                store.dispatch(showErrorNotification(store.getState().ui.text.messageError));
                store.dispatch(removeMessage({
                    _clientId: message._clientId
                }));

            });
        });
    }).catch(() => {
        store.dispatch(showErrorNotification(store.getState().ui.text.invalidFileError));
    });
}

export function getMessages() {
    return core().appUsers.getMessages(getUserId()).then((response) => {
        store.dispatch(setConversation({
            ...response.conversation,
            hasMoreMessages: !!response.previous
        }));
        store.dispatch(setMessages(response.messages));
        return response;
    });
}

export function connectFayeConversation() {
    const {faye: {conversationSubscription}} = store.getState();

    if (!conversationSubscription) {
        return subscribeConversation();
    }

    return Promise.resolve();
}

export function connectFayeUser() {
    const {faye: {userSubscription}} = store.getState();

    if (!userSubscription) {
        return subscribeUser();
    }

    return Promise.resolve();
}

export function disconnectFaye() {
    const {faye: {conversationSubscription, userSubscription}} = store.getState();

    if (conversationSubscription) {
        conversationSubscription.cancel();
    }

    if (userSubscription) {
        userSubscription.cancel();
    }

    disconnectClient();
    store.dispatch(unsetFayeSubscriptions());
}

export function resetUnreadCount() {
    const {conversation} = store.getState();
    if (conversation.unreadCount > 0) {
        store.dispatch(resetUnreadCountAction());
        return core().conversations.resetUnreadCount(getUserId()).then((response) => {
            return response;
        });
    }

    return Promise.resolve();
}

export function handleConversationUpdated() {
    const {faye: {conversationSubscription}} = store.getState();

    if (!conversationSubscription) {
        return getMessages()
            .then((response) => {
                return connectFayeConversation().then(() => {
                    return response;
                });
            });
    }

    return Promise.resolve();
}

export function postPostback(actionId) {
    return core().conversations.postPostback(getUserId(), actionId).catch(() => {
        store.dispatch(showErrorNotification(store.getState().ui.text.actionPostbackError));
    });
}


export function fetchMoreMessages() {
    const {conversation: {hasMoreMessages, messages, isFetchingMoreMessagesFromServer}} = store.getState();

    if (!hasMoreMessages || isFetchingMoreMessagesFromServer) {
        return Promise.resolve();
    }

    const timestamp = messages[0].received;
    store.dispatch(setFetchingMoreMessagesFromServer(true));
    return core().appUsers.getMessages(getUserId(), {
        before: timestamp
    }).then((response) => {
        store.dispatch(setConversation({
            ...response.conversation,
            hasMoreMessages: !!response.previous
        }));

        store.dispatch(addMessages(response.messages, false));
        store.dispatch(setFetchingMoreMessagesFromServer(false));
        store.dispatch(setFetchingMoreMessagesUi(false));
        return response;
    });
}
