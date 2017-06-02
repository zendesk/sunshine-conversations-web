import { Client } from 'faye';
import urljoin from 'urljoin';
import { batchActions } from 'redux-batched-actions';

import { setUser } from '../actions/user-actions';
import { setFayeConversationSubscription, setFayeUserSubscription, setFayeConversationActivitySubscription } from '../actions/faye-actions';
import { addMessage, incrementUnreadCount, resetUnreadCount } from '../actions/conversation-actions';
import { getMessages, disconnectFaye, handleConversationUpdated } from './conversation';
import { showSettings, hideChannelPage, hideConnectNotification, showTypingIndicator, hideTypingIndicator } from './app';
import { getDeviceId } from '../utils/device';
import { ANIMATION_TIMINGS } from '../constants/styles';
import { cancelTwilioLink } from './integrations';


let client;

export function getClient() {
    return (dispatch, getState) => {
        if (!client) {
            const {appState, auth, user} = getState();
            client = new Client(urljoin(appState.serverURL, 'faye'));

            client.addExtension({
                outgoing: (message, callback) => {
                    if (message.channel === '/meta/subscribe') {
                        message.ext = {
                            appUserId: user._id
                        };

                        if (auth.appToken) {
                            message.ext.appToken = auth.appToken;
                        }

                        if (auth.jwt) {
                            message.ext.jwt = auth.jwt;
                        }
                    }

                    callback(message);
                }
            });

            client.on('transport:up', function() {
                const {user} = getState();

                if (user.conversationStarted) {
                    dispatch(getMessages());
                }
            });
        }

        return client;
    };
}

export function handleConversationSubscription(message) {
    return (dispatch) => {
        if (message.source.id !== getDeviceId()) {
            dispatch(addMessage(message));

            if (message.role === 'appUser') {
                dispatch(resetUnreadCount());
            }
        }

        if (message.role !== 'appUser') {
            dispatch(incrementUnreadCount());
        }
    };
}

export function subscribeConversation() {
    return (dispatch, getState) => {
        const client = dispatch(getClient());
        const {conversation: {_id: conversationId}} = getState();
        const subscription = client.subscribe(`/v1/conversations/${conversationId}`, (message) => {
            dispatch(handleConversationSubscription(message));
        });

        return subscription.then(() => {
            return dispatch(setFayeConversationSubscription(subscription));
        });
    };
}

export function handleConversationActivitySubscription({activity, role, data={}}) {
    return (dispatch) => {
        if (role === 'appMaker') {
            // Web Messenger only handles appMaker activities for now

            switch (activity) {
                case 'typing:start':
                    return dispatch(showTypingIndicator(data));
                case 'typing:stop':
                    return dispatch(hideTypingIndicator());
            }
        }
    };
}

export function subscribeConversationActivity() {
    return (dispatch, getState) => {
        const client = dispatch(getClient());
        const {conversation: {_id: conversationId}} = getState();
        const subscription = client.subscribe(`/v1/conversations/${conversationId}/activity`, (message) => {
            dispatch(handleConversationActivitySubscription(message));
        });

        return subscription.then(() => {
            return dispatch(setFayeConversationActivitySubscription(subscription));
        });
    };
}

export function updateUser(currentAppUser, nextAppUser) {
    return (dispatch) => {
        if (currentAppUser._id !== nextAppUser._id) {
            // take no chances, that user might already be linked and it would crash
            dispatch(batchActions([
                hideChannelPage(),
                setUser(nextAppUser)
            ]));

            // Faye needs to be reconnected on the right user/conversation channels
            disconnectFaye();

            return dispatch(subscribeUser()).then(() => {
                if (nextAppUser.conversationStarted) {
                    return dispatch(handleConversationUpdated());
                }
            });
        } else {
            dispatch(setUser(nextAppUser));

            if (currentAppUser.conversationStarted) {
                // if the conversation is already started,
                // fetch the conversation for merged messages
                return dispatch(getMessages());
            } else if (nextAppUser.conversationStarted) {
                // if the conversation wasn't already started,
                // `handleConversationUpdated` will connect faye and fetch it
                return dispatch(handleConversationUpdated());
            }
        }
    };
}

export function handleUserSubscription({appUser, event}) {
    return (dispatch, getState) => {
        const {user: currentAppUser, appState: {visibleChannelType}} = getState();

        if (event.type === 'link') {
            dispatch(hideConnectNotification());
            const {platform} = appUser.clients.find((c) => c.id === event.clientId);
            if (platform === visibleChannelType) {
                dispatch(showSettings());
                // add a delay to let the settings page animation finish
                // if it wasn't open already
                return setTimeout(() => {
                    dispatch(hideChannelPage());

                    // add a delay to let the channel page hide, then update the user
                    // why? React will just remove the channel page from the DOM if
                    // we update the user right away.
                    setTimeout(() => {
                        dispatch(updateUser(currentAppUser, appUser));
                    }, ANIMATION_TIMINGS.PAGE_TRANSITION);
                }, ANIMATION_TIMINGS.PAGE_TRANSITION);
            }
        } else if (event.type === 'link:cancelled') {
            const {platform} = appUser.pendingClients.find((c) => c.id === event.clientId);
            if (platform === 'twilio') {
                return dispatch(cancelTwilioLink());
            }
        }

        return dispatch(updateUser(currentAppUser, appUser));
    };
}

export function subscribeUser() {
    return (dispatch, getState) => {
        const client = dispatch(getClient());
        const {user} = getState();
        const subscription = client.subscribe(`/v1/users/${user._id}`, (message) => {
            dispatch(handleUserSubscription(message));
        });

        return subscription.then(() => {
            return dispatch(setFayeUserSubscription(subscription));
        });
    };
}

export function disconnectClient() {
    if (client) {
        client.disconnect();
        client = undefined;
    }
}
