import Raven from 'raven-js';
import { batchActions } from 'redux-batched-actions';

import { showErrorNotification, setShouldScrollToBottom, setFetchingMoreMessages as setFetchingMoreMessagesUi, showConnectNotification } from './app-state';
import { setUser } from './user';
import { disconnectClient, subscribe as subscribeFaye, unsetFayeSubscription } from './faye';

import http from './http';
import { setAuth } from './auth';

import { observable } from '../utils/events';
import { Throttle } from '../utils/throttle';
import { resizeImage, getBlobFromDataUrl, isFileTypeSupported } from '../utils/media';
import { getClientId, getClientInfo } from '../utils/client';
import * as storage from '../utils/storage';
import { hasLinkableChannels, getLinkableChannels, isChannelLinked } from '../utils/user';
import { getWindowLocation } from '../utils/dom';
import { CONNECT_NOTIFICATION_DELAY_IN_SECONDS } from '../constants/notifications';
import { SEND_STATUS, LOCATION_ERRORS } from '../constants/message';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_MESSAGES = 'ADD_MESSAGES';
export const REPLACE_MESSAGE = 'REPLACE_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const RESET_CONVERSATION = 'RESET_CONVERSATION';
export const SET_CONVERSATION = 'SET_CONVERSATION';
export const SET_MESSAGES = 'SET_MESSAGES';
export const RESET_UNREAD_COUNT = 'RESET_UNREAD_COUNT';
export const INCREMENT_UNREAD_COUNT = 'INCREMENT_UNREAD_COUNT';
export const SET_FETCHING_MORE_MESSAGES_FROM_SERVER = 'SET_FETCHING_MORE_MESSAGES_FROM_SERVER';


export function resetConversation() {
    return {
        type: RESET_CONVERSATION
    };
}

export function setConversation(props) {
    return {
        type: SET_CONVERSATION,
        conversation: props
    };
}

export function setMessages(messages) {
    return {
        type: SET_MESSAGES,
        messages
    };
}


export function addMessages(messages, append = true) {
    return {
        type: ADD_MESSAGES,
        messages,
        append
    };
}

export function replaceMessage(queryProps, message) {
    return {
        type: REPLACE_MESSAGE,
        queryProps,
        message
    };
}

export function incrementUnreadCount() {
    return {
        type: INCREMENT_UNREAD_COUNT
    };
}

export function setFetchingMoreMessagesFromServer(value) {
    return {
        type: SET_FETCHING_MORE_MESSAGES_FROM_SERVER,
        value
    };
}

// Throttle requests per appUser
const throttleMap = {};
const throttlePerUser = (userId) => {
    if (!throttleMap[userId]) {
        throttleMap[userId] = new Throttle();
    }

    return throttleMap[userId];
};

function postSendMessage(message) {
    return (dispatch, getState) => {
        const {config: {appId}, user: {_id}} = getState();
        return dispatch(http('POST', `/apps/${appId}/appusers/${_id}/messages`, {
            message,
            sender: {
                type: 'appUser',
                client: getClientInfo(appId)
            }
        }));
    };
}

function postUploadImage(message) {
    return (dispatch, getState) => {
        const {config: {appId}, user: {_id}} = getState();
        const blob = getBlobFromDataUrl(message.mediaUrl);

        const data = new FormData();
        data.append('source', blob);
        data.append('sender', {
            type: 'appUser',
            client: getClientInfo(appId)
        });

        Object.keys(message).forEach((key) => {
            data.append(key, message[key]);
        });

        return dispatch(http('POST', `/apps/${appId}/appusers/${_id}/images`, data));
    };
}

function onMessageSendSuccess(message, response) {
    return (dispatch) => {
        const actions = [];

        actions.push(setShouldScrollToBottom(true));
        actions.push(replaceMessage({
            _clientId: message._clientId
        }, response.message));

        dispatch(batchActions(actions));
        observable.trigger('message:sent', response.message);

        return response;
    };
}

function onMessageSendFailure(message) {
    return (dispatch) => {
        const actions = [];
        message.sendStatus = SEND_STATUS.FAILED;

        actions.push(setShouldScrollToBottom(true));
        actions.push(replaceMessage({
            _clientId: message._clientId
        }, message));

        dispatch(batchActions(actions));
    };
}

function addMessage(props) {
    return (dispatch, getState) => {
        const {config: {appId}} = getState();
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
            sendStatus: SEND_STATUS.SENDING,
            source: {
                id: getClientId(appId)
            }
        };

        if (typeof props === 'string') {
            message.text = props;
        } else {
            Object.assign(message, props);
        }

        dispatch(batchActions([
            setShouldScrollToBottom(true),
            {
                type: ADD_MESSAGE,
                message
            }
        ]));

        return message;
    };
}


function removeMessage(_clientId) {
    return (dispatch) => {
        dispatch(batchActions([
            setShouldScrollToBottom(true),
            {
                type: REMOVE_MESSAGE,
                queryProps: {
                    _clientId
                }
            }
        ]));
    };
}

function _getMessages({before} = {}) {
    return (dispatch, getState) => {
        const {user: {_id}, config: {appId}} = getState();

        return dispatch(http('GET', `/apps/${appId}/appusers/${_id}/messages`, {
            before
        }));
    };
}

function sendChain(sendFn, message) {
    return (dispatch) => {
        const promise = dispatch(startConversation());

        const postSendHandler = (response) => {
            return Promise.resolve(dispatch(onMessageSendSuccess(message, response)))
                .then(() => dispatch(handleConnectNotification(response)));
        };

        return promise
            .then(() => {
                return dispatch(sendFn(message))
                    .then(postSendHandler)
                    .catch(() => dispatch(onMessageSendFailure(message)));
            });
    };
}

export function sendMessage(props) {
    return (dispatch) => {
        const message = dispatch(addMessage(props));
        return dispatch(sendChain(postSendMessage, message));
    };
}

export function postPostback(actionId) {
    return (dispatch, getState) => {
        const {user: {_id}, config: {appId}} = getState();

        return dispatch(http('POST', `/apps/${appId}/appusers/${_id}/postback`, {
            postback: {
                actionId
            },
            sender: {
                type: 'appUser',
                client: getClientInfo(appId)
            }
        })).catch(() => {
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

        return dispatch(_getMessages({
            before: timestamp
        })).then((response) => {
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
        const {user: {clients}, config: {integrations}, conversation: {messages}} = getState();
        const appUserMessages = messages.filter((message) => message.role === 'appUser');

        const channelsAvailable = hasLinkableChannels(integrations, clients);
        const hasSomeChannelLinked = getLinkableChannels(integrations).some((channelType) => {
            return isChannelLinked(clients, channelType);
        });

        if (channelsAvailable && !hasSomeChannelLinked) {
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

export function resetUnreadCount() {
    return (dispatch, getState) => {
        const {user: {_id}, config: {appId}, conversation} = getState();
        if (conversation.unreadCount > 0) {
            dispatch({
                type: RESET_UNREAD_COUNT
            });

            return dispatch(http('POST', `/apps/${appId}/appusers/${_id}/conversation/read`)).then((response) => {
                return response;
            });
        }

        return Promise.resolve();
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
        const {user: {_id}} = getState();
        return throttlePerUser(_id).exec(() => {
            return dispatch(_getMessages())
                .then((response) => {
                    dispatch(batchActions([
                        setConversation({
                            ...response.conversation,
                            hasMoreMessages: !!response.previous
                        }),
                        setMessages(response.messages)
                    ]));
                    return response;
                });
        });
    };
}

export function disconnectFaye() {
    return (dispatch, getState) => {
        const {faye: {subscription}} = getState();

        if (subscription) {
            subscription.cancel();
        }

        disconnectClient();
        dispatch(unsetFayeSubscription());
    };
}

export function handleUserConversationResponse({appUser, conversation, hasPrevious, messages, sessionToken}) {
    return (dispatch, getState) => {
        const {config: {appId}} = getState();
        Raven.setUserContext({
            id: appUser._id
        });

        const actions = [
            setUser(appUser),
            setConversation({
                ...conversation,
                hasMoreMessages: hasPrevious
            }),
            setMessages(messages)
        ];

        storage.setItem(`${appId}.appUserId`, appUser._id);

        if (sessionToken) {
            storage.setItem(`${appId}.sessionToken`, sessionToken);
            actions.push(setAuth({
                sessionToken
            }));
        }

        dispatch(batchActions(actions));

        if (appUser.conversationStarted) {
            return dispatch(subscribeFaye());
        }

        return Promise.resolve();
    };
}

export function startConversation() {
    return (dispatch, getState) => {
        const {user: {_id: userId, pendingAttributes}, config: {appId}, conversation: {_id: conversationId}} = getState();

        if (conversationId) {
            return Promise.resolve();
        }

        let promise;
        if (userId) {
            promise = dispatch(http('POST', `/appusers/${userId}/conversations`));
        } else {
            promise = dispatch(http('POST', `/apps/${appId}/appusers`, {
                ...pendingAttributes,
                client: getClientInfo(appId)
            }));
        }

        return promise
            .then((response) => dispatch(handleUserConversationResponse(response)));
    };
}

export function fetchUserConversation() {
    return (dispatch, getState) => {
        const {user: {_id}, config: {appId}} = getState();

        return dispatch(http('GET', `/apps/${appId}/appusers/${_id}`))
            .then((response) => dispatch(handleUserConversationResponse(response)));
    };
}
