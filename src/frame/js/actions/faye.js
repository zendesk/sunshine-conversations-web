import { Client, Scheduler as FayeScheduler } from 'faye';
import { batchActions } from 'redux-batched-actions';

import { setUser } from './user';
import { showSettings, showTypingIndicator, hideTypingIndicator, hideChannelPage, hideConnectNotification } from './app-state';
import { addMessage, incrementUnreadCount, resetUnreadCount, getMessages, fetchUserConversation, disconnectFaye, resetConversation } from './conversation';
import { cancelSMSLink, failSMSLink, resetIntegrations } from './integrations';
import { getClientId } from '../utils/client';
import { ANIMATION_TIMINGS } from '../constants/styles';
import { login, setAuth } from './auth';
import { setItem } from '../utils/storage';

export const SET_FAYE_SUBSCRIPTION = 'SET_FAYE_SUBSCRIPTION';
export const UNSET_FAYE_SUBSCRIPTION = 'UNSET_FAYE_SUBSCRIPTION';

export function setFayeSubscription(subscription) {
    return {
        type: SET_FAYE_SUBSCRIPTION,
        subscription
    };
}

export function unsetFayeSubscription() {
    return {
        type: UNSET_FAYE_SUBSCRIPTION
    };
}

let client;

const getScheduler = ({retryInterval, maxConnectionAttempts}) => {
    return class Scheduler extends FayeScheduler {
        getInterval() {
            return retryInterval;
        }

        isDeliverable() {
            const isDeliverable = super.isDeliverable();
            if (!isDeliverable) {
                return false;
            }

            const {channel} = this.message;

            // target only setup messages
            if (['/meta/handshake', '/meta/connect', '/meta/subscribe'].includes(channel)) {
                return this.attempts < maxConnectionAttempts;
            }

            return true;
        }
    };
};

function getClient() {
    return (dispatch, getState) => {
        if (!client) {
            const {config: {realtime, appId}, auth, user} = getState();

            const Scheduler = getScheduler(realtime);

            client = new Client(realtime.baseUrl, {
                scheduler: Scheduler
            });

            client.addExtension({
                outgoing: (message, callback) => {
                    if (message.channel === '/meta/subscribe') {
                        message.ext = {
                            appUserId: user._id,
                            appId
                        };

                        if (auth.jwt) {
                            message.ext.jwt = auth.jwt;
                        } else if (auth.sessionToken) {
                            message.ext.sessionToken = auth.sessionToken;
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

function handleMessageEvents(events) {
    return (dispatch, getState) => {
        const {config: {appId}, conversation: {_id: currentConversationId}} = getState();

        // Discard messages sent from the current client
        // and messages not related to the current conversation.
        // To be changed once the Web Messenger supports
        // multiple conversations.

        events
            .filter(({conversation, message}) => conversation._id === currentConversationId && message.source.id !== getClientId(appId))
            .forEach(({message}) => {
                dispatch(addMessage(message));

                if (message.role === 'appUser') {
                    dispatch(resetUnreadCount());
                } else {
                    dispatch(incrementUnreadCount());
                }
            });
    };
}

function handleActivityEvents(events) {
    return (dispatch, getState) => {
        const {conversation: {_id: currentConversationId}} = getState();

        // Discard messages not related to the current conversation.
        // To be changed once the Web Messenger supports
        // multiple conversations.

        events
            .filter(({conversation}) => conversation._id === currentConversationId)
            .forEach(({activity: {type, role, data}}) => {
                if (role === 'appMaker') {
                    // Web Messenger only handles appMaker activities for now
                    switch (type) {
                        case 'typing:start':
                            return dispatch(showTypingIndicator(data));
                        case 'typing:stop':
                            return dispatch(hideTypingIndicator());
                    }
                }
            });
    };
}

function updateUser(currentAppUser, nextAppUser, client) {
    return (dispatch, getState) => {
        if (currentAppUser._id !== nextAppUser._id) {
            const {config: {appId}, auth: {jwt}} = getState();
            const actions = [
                resetConversation(),
                resetIntegrations()
            ];
            actions.push(setUser({
                _id: nextAppUser._id
            }));
            setItem(`${appId}.appUserId`, nextAppUser._id);

            if (nextAppUser.sessionToken) {
                actions.push(setAuth({
                    sessionToken: nextAppUser.sessionToken
                }));
                setItem(`${appId}.sessionToken`, nextAppUser.sessionToken);
            }

            dispatch(disconnectFaye());
            dispatch(batchActions(actions));

            if (nextAppUser.userId) {
                return dispatch(login(nextAppUser.userId, jwt));
            } else {
                return dispatch(fetchUserConversation());
            }
        } else {
            dispatch(setUser({
                ...currentAppUser,
                clients: [
                    ...currentAppUser.clients,
                    client
                ]
            }));

            return dispatch(getMessages());
        }
    };
}

function handleLinkEvents(events) {
    return (dispatch, getState) => {
        events.forEach(({type, appUser, client, err}) => {
            const {user: currentAppUser, appState: {visibleChannelType}} = getState();

            if (type === 'link') {
                dispatch(hideConnectNotification());
                if (client.platform === visibleChannelType) {
                    dispatch(showSettings());
                    // add a delay to let the settings page animation finish
                    // if it wasn't open already
                    return setTimeout(() => {
                        dispatch(hideChannelPage());

                        // add a delay to let the channel page hide, then update the user
                        // why? React will just remove the channel page from the DOM if
                        // we update the user right away.
                        setTimeout(() => {
                            dispatch(updateUser(currentAppUser, appUser, client));
                        }, ANIMATION_TIMINGS.PAGE_TRANSITION);
                    }, ANIMATION_TIMINGS.PAGE_TRANSITION);
                }

                return dispatch(updateUser(currentAppUser, appUser, client));
            } else if (type === 'link:cancelled') {
                if (client.platform === 'twilio' || client.platform === 'messagebird') {
                    return dispatch(cancelSMSLink(client.platform));
                }
            } else if (type === 'link:failed') {
                if (client && (client.platform === 'twilio' || client.platform === 'messagebird')) {
                    return dispatch(failSMSLink(err, client.platform));
                }
            }
        });
    };
}

export function subscribe() {
    return (dispatch, getState) => {
        const {config: {appId}, user: {_id}, faye: {subscription: existingSubscription}} = getState();

        if (!_id) {
            return Promise.resolve();
        }

        if (existingSubscription) {
            return existingSubscription;
        }

        const client = dispatch(getClient());
        const subscription = client.subscribe(`/sdk/apps/${appId}/appusers/${_id}`, function({events}) {
            const messageEvents = events.filter(({type}) => type === 'message');
            const activityEvents = events.filter(({type}) => type === 'activity');
            const linkEvents = events.filter(({type}) => type.startsWith('link'));

            if (messageEvents.length > 0) {
                dispatch(handleMessageEvents(messageEvents));
            }

            if (activityEvents.length > 0) {
                dispatch(handleActivityEvents(activityEvents));
            }

            if (linkEvents.length > 0) {
                dispatch(handleLinkEvents(linkEvents));
            }
        });

        return subscription.then(() => dispatch(setFayeSubscription(subscription)));
    };
}

export function disconnectClient() {
    return () => {
        if (client) {
            client.disconnect();
            client = undefined;
        }
    };
}
