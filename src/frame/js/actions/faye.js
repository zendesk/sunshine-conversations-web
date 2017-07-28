import { Client, Scheduler as FayeScheduler } from 'faye';
import { batchActions } from 'redux-batched-actions';

import { setUser } from './user';
import { showSettings, showTypingIndicator, hideTypingIndicator, hideChannelPage, hideConnectNotification } from './app-state';
import { addMessage, incrementUnreadCount, resetUnreadCount, getMessages, disconnectFaye } from './conversation';
import { cancelSMSLink, failSMSLink } from './integrations';
import { getClientId } from '../utils/client';
import { ANIMATION_TIMINGS } from '../constants/styles';


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

export function getClient() {
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

export function handleConversationSubscription(message) {
    return (dispatch, getState) => {
        const {config: {appId}} = getState();
        if (message.source.id !== getClientId(appId)) {
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

export function subscribe() {
    return (dispatch, getState) => {
        const client = dispatch(getClient());
        const {config: {appId}, user: {_id}} = getState();
        const subscription = client.subscribe(`/sdk/apps/${appId}/appusers/${_id}`, ({type, ...rest}) => {
            console.log('Faye message received', type, rest);
        });

        return subscription.then(() => {
            return dispatch(setFayeSubscription(subscription));
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

            return dispatch(subscribe()).then(() => {
                // TODO : figure out if still relevant
                // if (nextAppUser.conversationStarted) {
                //     return dispatch(handleConversationUpdated());
                // }
            });
        } else {
            dispatch(setUser(nextAppUser));

            if (currentAppUser.conversationStarted) {
                // if the conversation is already started,
                // fetch the conversation for merged messages
                return dispatch(getMessages());
            } else if (nextAppUser.conversationStarted) {
                // TODO : figure out if still relevant
                // if the conversation wasn't already started,
                // `handleConversationUpdated` will connect faye and fetch it
                // return dispatch(handleConversationUpdated());
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
            if (platform === 'twilio' || platform === 'messagebird') {
                return dispatch(cancelSMSLink(platform));
            }
        } else if (event.type === 'link:failed') {
            const pendingClient = currentAppUser.pendingClients.find((c) => c.id === event.clientId);

            if (pendingClient && (pendingClient.platform === 'twilio' || pendingClient.platform === 'messagebird')) {
                return dispatch(failSMSLink(event.err, pendingClient.platform));
            }
        } else if (event.type === 'link:failed') {
            const pendingClient = currentAppUser.pendingClients.find((c) => c.id === event.clientId);

            if (pendingClient && pendingClient.platform === 'twilio') {
                return dispatch(failSMSLink(event.err));
            }
        }

        return dispatch(updateUser(currentAppUser, appUser));
    };
}

export function disconnectClient() {
    if (client) {
        client.disconnect();
        client = undefined;
    }
}
