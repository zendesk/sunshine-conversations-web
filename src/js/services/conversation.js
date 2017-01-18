import { batchActions } from 'redux-batched-actions';

import { showConnectNotification } from '../services/app';
import { addMessage, addMessages, replaceMessage, removeMessage, setConversation, resetUnreadCount as resetUnreadCountAction, setMessages, setFetchingMoreMessagesFromServer } from '../actions/conversation-actions';
import { updateUser } from '../actions/user-actions';
import { showErrorNotification, setShouldScrollToBottom, setFetchingMoreMessages as setFetchingMoreMessagesUi } from '../actions/app-state-actions';
import { unsetFayeSubscriptions } from '../actions/faye-actions';
import { core } from './core';
import { immediateUpdate } from './user';
import { disconnectClient, subscribeConversation, subscribeUser, subscribeConversationActivity } from './faye';
import { observable } from '../utils/events';
import { resizeImage, getBlobFromDataUrl, isFileTypeSupported } from '../utils/media';
import { getDeviceId } from '../utils/device';
import { hasLinkableChannels, getLinkableChannels, isChannelLinked } from '../utils/user';
import { CONNECT_NOTIFICATION_DELAY_IN_SECONDS } from '../constants/notifications';
import { getUserId } from './user';

export function handleConnectNotification(response) {
    return (dispatch, getState) => {

        const {user: {clients, email}, app: {integrations, settings}, conversation: {messages}, appState: {emailCaptureEnabled}} = getState();
        const appUserMessages = messages.filter((message) => message.role === 'appUser');

        const channelsAvailable = hasLinkableChannels(integrations, clients, settings.web);
        const showEmailCapture = emailCaptureEnabled && !email;
        const hasSomeChannelLinked = getLinkableChannels(integrations, settings.web).some((channelType) => {
            return isChannelLinked(clients, channelType);
        });

        if ((showEmailCapture || channelsAvailable) && !hasSomeChannelLinked) {
            if (appUserMessages.length === 1) {
                dispatch(showConnectNotification());
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
                        dispatch(showConnectNotification());
                    }
                }
            }
        }

        return response;
    };
}

export function sendChain(sendFn) {
    return (dispatch, getState) => {
        const promise = immediateUpdate(getState().user);

        const enableScrollToBottom = (response) => {
            dispatch(setShouldScrollToBottom(true));
            return response;
        };

        if (getState().user.conversationStarted) {
            return promise
                .then(connectFayeConversation)
                .then(() => {
                    return dispatch(sendFn());
                })
                .then(enableScrollToBottom)
                .then(handleConnectNotification);
        }

        // if it's not started, send the message first to create the conversation,
        // then get it and connect faye
        return promise
            .then(() => {
                return dispatch(sendFn());
            })
            .then(enableScrollToBottom)
            .then(handleConnectNotification)
            .then(connectFayeConversation);
    };
}

export function sendMessage(text, extra = {}) {
    return (dispatch) => {
        const fn = (dispatch, getState) => {
            const message = {
                role: 'appUser',
                text,
                _clientId: Math.random(),
                _clientSent: new Date(),
                deviceId: getDeviceId(),
                ...extra
            };

            dispatch(batchActions([
                setShouldScrollToBottom(true),
                addMessage(message)
            ]));

            const {user} = getState();

            return core(getState()).appUsers.sendMessage(getUserId(getState()), message).then((response) => {
                const actions = [];
                if (!user.conversationStarted) {
                    // use setConversation to set the conversation id in the store
                    actions.push(setConversation(response.conversation));
                    actions.push(updateUser({
                        conversationStarted: true
                    }));
                }
                actions.push(replaceMessage({
                    _clientId: message._clientId
                }, response.message));

                dispatch(batchActions(actions));

                observable.trigger('message:sent', response.message);
                return response;
            }).catch(() => {
                dispatch(batchActions([
                    showErrorNotification(getState().ui.text.messageError),
                    removeMessage({
                        _clientId: message._clientId
                    })
                ]));
            });
        };

        return dispatch(sendChain(fn));
    };
}


export function uploadImage(file) {
    return (dispatch, getState) => {

        if (!isFileTypeSupported(file.type)) {
            dispatch(showErrorNotification(getState().ui.text.invalidFileError));
            return Promise.reject('Invalid file type');
        }

        return resizeImage(file)
            .then((dataUrl) => {
                const fn = (dispatch, getState) => {
                    () => {
                        const message = {
                            mediaUrl: dataUrl,
                            mediaType: 'image/jpeg',
                            role: 'appUser',
                            type: 'image',
                            status: 'sending',
                            _clientId: Math.random(),
                            _clientSent: new Date()
                        };

                        dispatch(addMessage(message));

                        const {user} = getState();
                        const blob = getBlobFromDataUrl(dataUrl);

                        return core(getState()).appUsers.uploadImage(getUserId(getState()), blob, {
                            role: 'appUser',
                            deviceId: getDeviceId()
                        }).then((response) => {
                            const actions = [];
                            if (!user.conversationStarted) {
                                // use setConversation to set the conversation id in the store
                                actions.push(setConversation(response.conversation));
                                actions.push(updateUser({
                                    conversationStarted: true
                                }));
                            }

                            actions.push(replaceMessage({
                                _clientId: message._clientId
                            }, response.message));


                            dispatch(batchActions(actions));
                            observable.trigger('message:sent', response.message);
                            return response;
                        }).catch(() => {
                            dispatch(batchActions([
                                showErrorNotification(getState().ui.text.messageError),
                                removeMessage({
                                    _clientId: message._clientId
                                })
                            ]));
                        });
                    };
                };
                return dispatch(sendChain(fn));
            })
            .catch(() => {
                dispatch(showErrorNotification(getState().ui.text.invalidFileError));
            });
    };
}

export function getMessages() {
    return (dispatch, getState) => {
        return core(getState()).appUsers.getMessages(getUserId(getState())).then((response) => {
            dispatch(batchActions([
                setConversation({
                    ...response.conversation,
                    hasMoreMessages: !!response.previous
                }),
                setMessages(response.messages)
            ]));
            return response;
        });
    };
}

export function connectFayeConversation() {
    return (dispatch, getState) => {
        const {faye: {conversationSubscription}} = getState();

        if (!conversationSubscription) {
            return Promise.all([
                dispatch(subscribeConversation()),
                dispatch(subscribeConversationActivity())
            ]);
        }

        return Promise.resolve();
    };
}

export function connectFayeUser() {
    return (dispatch, getState) => {

        const {faye: {userSubscription}} = getState();

        if (!userSubscription) {
            return dispatch(subscribeUser());
        }

        return Promise.resolve();
    };
}

export function disconnectFaye() {
    return (dispatch, getState) => {
        const {faye: {conversationSubscription, userSubscription}} = getState();

        if (conversationSubscription) {
            conversationSubscription.cancel();
        }

        if (userSubscription) {
            userSubscription.cancel();
        }

        disconnectClient();
        dispatch(unsetFayeSubscriptions());
    };
}

export function resetUnreadCount() {
    return (dispatch, getState) => {
        const {conversation} = getState();
        if (conversation.unreadCount > 0) {
            dispatch(resetUnreadCountAction());
            return core(getState()).conversations.resetUnreadCount(getUserId(getState())).then((response) => {
                return response;
            });
        }

        return Promise.resolve();
    };
}

export function handleConversationUpdated() {
    return (dispatch, getState) => {
        const {faye: {conversationSubscription}} = getState();

        if (!conversationSubscription) {
            return dispatch(getMessages())
                .then((response) => {
                    return dispatch(connectFayeConversation())
                        .then(() => {
                            return response;
                        });
                });
        }

        return Promise.resolve();
    };
}

export function postPostback(actionId) {
    return (dispatch, getState) => {
        return core(getState()).conversations.postPostback(getUserId(getState()), actionId).catch(() => {
            dispatch(showErrorNotification(getState().ui.text.actionPostbackError));
        });
    };
}


export function fetchMoreMessages() {
    return (dispatch, getState) => {
        const {conversation: {hasMoreMessages, messages, isFetchingMoreMessagesFromServer}} = getState();

        if (!hasMoreMessages || isFetchingMoreMessagesFromServer) {
            return Promise.resolve();
        }

        const timestamp = messages[0].received;
        dispatch(setFetchingMoreMessagesFromServer(true));
        return core(getState()).appUsers.getMessages(getUserId(getState()), {
            before: timestamp
        }).then((response) => {
            dispatch(batchActions([
                setConversation({
                    ...response.conversation,
                    hasMoreMessages: !!response.previous
                }),
                addMessages(response.messages, false),
                setFetchingMoreMessagesFromServer(false),
                setFetchingMoreMessagesUi(false)
            ]));
            return response;
        });
    };
}
