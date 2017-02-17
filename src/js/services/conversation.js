import { batchActions } from 'redux-batched-actions';

import { showConnectNotification } from '../services/app';
import { addMessage as addMessageAction, addMessages, removeMessage as removeMessageAction, replaceMessage, setConversation, resetUnreadCount as resetUnreadCountAction, setMessages, setFetchingMoreMessagesFromServer } from '../actions/conversation-actions';
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
import { getWindowLocation } from '../utils/dom';
import { CONNECT_NOTIFICATION_DELAY_IN_SECONDS } from '../constants/notifications';
import { SEND_STATUS, LOCATION_ERRORS } from '../constants/message';
import { getUserId } from './user';

const postSendMessage = (message) => {
    return (dispatch, getState) => {
        return core(getState()).appUsers.sendMessage(getUserId(getState()), message);
    };
};

const postUploadImage = (message) => {
    return (dispatch, getState) => {
        const blob = getBlobFromDataUrl(message.mediaUrl);

        return core(getState()).appUsers.uploadImage(getUserId(getState()), blob, {
            role: 'appUser',
            deviceId: getDeviceId()
        });
    };
};

const onMessageSendSuccess = (message, response) => {
    return (dispatch, getState) => {
        const actions = [];
        const {user} = getState();

        if (!user.conversationStarted) {
            // use setConversation to set the conversation id in the store
            actions.push(setConversation(response.conversation));
            actions.push(updateUser({
                conversationStarted: true
            }));
        }

        actions.push(setShouldScrollToBottom(true));
        actions.push(replaceMessage({
            _clientId: message._clientId
        }, response.message));

        dispatch(batchActions(actions));
        observable.trigger('message:sent', response.message);

        return response;
    };
};

const onMessageSendFailure = (message) => {
    return (dispatch) => {
        const actions = [];
        message.sendStatus = SEND_STATUS.FAILED;

        actions.push(setShouldScrollToBottom(true));
        actions.push(replaceMessage({
            _clientId: message._clientId
        }, message));

        dispatch(batchActions(actions));
    };
};

const addMessage = (props) => {
    return (dispatch, getState) => {
        if (props._clientId) {
            const oldMessage = getState().conversation.messages.find((message) => message._clientId === props._clientId);
            const newMessage = Object.assign({}, oldMessage, props);

            dispatch(replaceMessage({
                _clientId: props._clientId
            }, newMessage));

            return newMessage;
        }

        const message = {
            type: 'text',
            role: 'appUser',
            _clientId: Math.random(),
            _clientSent: Date.now() / 1000,
            deviceId: getDeviceId(),
            sendStatus: SEND_STATUS.SENDING
        };

        if (typeof props === 'string') {
            message.text = props;
        } else {
            Object.assign(message, props);
        }

        dispatch(batchActions([
            setShouldScrollToBottom(true),
            addMessageAction(message)
        ]));

        return message;
    };
};

const removeMessage = (messageClientId) => {
    return (dispatch) => {
        dispatch(batchActions([
            setShouldScrollToBottom(true),
            removeMessageAction({
                _clientId: messageClientId
            })
        ]));
    };
};

export function sendMessage(props) {
    return (dispatch) => {
        const message = dispatch(addMessage(props));
        return dispatch(sendChain(postSendMessage, message));
    };
}

export function resendMessage(messageClientId) {
    return (dispatch, getState) => {
        const oldMessage = getState().conversation.messages.find((message) => message._clientId === messageClientId);

        if (!oldMessage) {
            return;
        }

        const newMessage = Object.assign({}, oldMessage, {
            sendStatus: SEND_STATUS.SENDING
        });

        dispatch(replaceMessage({
            _clientId: messageClientId
        }, newMessage));

        if (newMessage.type === 'text') {
            return dispatch(sendChain(postSendMessage, newMessage));
        } else if (newMessage.type === 'location') {
            if (newMessage.coordinates) {
                return dispatch(sendChain(postSendMessage, newMessage));
            } else {
                return dispatch(sendLocation(newMessage));
            }
        }

        return dispatch(sendChain(postUploadImage, newMessage));
    };
}

export function sendLocation(props = {}) {
    return (dispatch, getState) => {
        let message;

        if (props._clientSent) {
            message = props;
        } else {
            message = dispatch(addMessage({
                type: 'location',
                ...props
            }));
        }

        if (message.coordinates) {
            return dispatch(sendChain(postSendMessage, message));
        }

        const locationServicesDeniedText = getState().ui.text.locationServicesDenied;
        const locationSecurityRestrictionText = getState().ui.text.locationSecurityRestriction;

        return new Promise((resolve) => {
            let timedOut = false;

            const timeout = setTimeout(() => {
                timedOut = true;
                dispatch(onMessageSendFailure(message));
                resolve();
            }, 10000);

            navigator.geolocation.getCurrentPosition((position) => {
                clearTimeout(timeout);
                if (timedOut) {
                    return;
                }

                Object.assign(message, {
                    coordinates: {
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    }
                });

                dispatch(replaceMessage({
                    _clientId: message._clientId
                }, message));

                dispatch(sendChain(postSendMessage, message))
                    .then(resolve);
            }, (err) => {
                clearTimeout(timeout);
                if (timedOut) {
                    return;
                }
                if (getWindowLocation().protocol !== 'https:') {
                    setTimeout(() => alert(locationSecurityRestrictionText), 100);
                    dispatch(removeMessage(message._clientId));
                } else if (err.code === LOCATION_ERRORS.PERMISSION_DENIED) {
                    setTimeout(() => alert(locationServicesDeniedText), 100);
                    dispatch(removeMessage(message._clientId));
                } else {
                    dispatch(onMessageSendFailure(message));
                }
                resolve();
            });
        });
    };
}

export function uploadImage(file) {
    return (dispatch, getState) => {
        if (!isFileTypeSupported(file.type)) {
            return Promise.resolve(dispatch(showErrorNotification(getState().ui.text.invalidFileError)));
        }

        return resizeImage(file)
            .then((dataUrl) => {
                const message = dispatch(addMessage({
                    mediaUrl: dataUrl,
                    mediaType: 'image/jpeg',
                    type: 'image'
                }));
                return dispatch(sendChain(postUploadImage, message));
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
        return core(getState()).conversations.postPostback(getUserId(getState()), actionId)
            .catch(() => {
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

export function sendChain(sendFn, message) {
    return (dispatch, getState) => {
        const promise = dispatch(immediateUpdate(getState().user));

        const postSendHandler = (response) => {
            return Promise.resolve(dispatch(onMessageSendSuccess(message, response)))
                .then(() => dispatch(handleConnectNotification(response)))
                .then(() => dispatch(connectFayeConversation()))
                .catch(); // swallow errors to avoid uncaught promises bubbling up
        };

        return promise
            .then(() => {
                return dispatch(sendFn(message))
                    .then(postSendHandler)
                    .catch(() => dispatch(onMessageSendFailure(message)));
            });
    };
}
