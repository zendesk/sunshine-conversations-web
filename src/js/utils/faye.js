import { Client } from 'faye';
import urljoin from 'urljoin';

import { store } from '../stores/app-store';
import { setUser } from '../actions/user-actions';
import { setFayeConversationSubscription, setFayeUserSubscription } from '../actions/faye-actions';
import { addMessage, incrementUnreadCount } from '../actions/conversation-actions';
import { getConversation, disconnectFaye, handleConversationUpdated } from '../services/conversation-service';
import { showSettings, hideChannelPage } from '../services/app-service';
import { getDeviceId } from './device';
import { ANIMATION_TIMINGS } from '../constants/styles';


let client;

export function getClient() {
    if (!client) {
        const {appState, auth, user} = store.getState();
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
            const {user} = store.getState();

            if (user.conversationStarted) {
                getConversation();
            }
        });
    }

    return client;
}

export function handleConversationSubscription(message) {
    if (message.source.id !== getDeviceId()) {
        store.dispatch(addMessage(message));
    }
    if (message.role !== 'appUser') {
        store.dispatch(incrementUnreadCount());
    }
}

export function subscribeConversation() {
    const client = getClient();
    const {conversation: {_id: conversationId}} = store.getState();
    const subscription = client.subscribe(`/v1/conversations/${conversationId}`, handleConversationSubscription);

    return subscription.then(() => {
        store.dispatch(setFayeConversationSubscription(subscription));
    });
}

export function updateUser(currentAppUser, nextAppUser) {
    if (currentAppUser._id !== nextAppUser._id) {
        // take no chances, that user might already be linked and it would crash
        hideChannelPage();

        // Faye needs to be reconnected on the right user/conversation channels
        disconnectFaye();

        store.dispatch(setUser(nextAppUser));
        subscribeUser().then(() => {
            if (nextAppUser.conversationStarted) {
                return handleConversationUpdated();
            }
        });
    } else {
        store.dispatch(setUser(nextAppUser));

        if (currentAppUser.conversationStarted) {
            // if the conversation is already started,
            // fetch the conversation for merged messages
            getConversation();
        } else if (nextAppUser.conversationStarted) {
            // if the conversation wasn't already started,
            // `handleConversationUpdated` will connect faye and fetch it
            handleConversationUpdated();
        }
    }
}

export function handleUserSubscription({appUser, event}) {
    const {user: currentAppUser, appState: {visibleChannelType}} = store.getState();

    if (event.type === 'channel-linking') {
        const {platform} = appUser.clients.find((c) => c.id === event.clientId);
        if (platform === visibleChannelType) {
            showSettings();
            // add a delay to let the settings page animation finish
            // if it wasn't open already
            return setTimeout(() => {
                hideChannelPage();

                // add a delay to let the channel page hide, then update the user
                // why? React will just remove the channel page from the DOM if
                // we update the user right away.
                setTimeout(() => {
                    updateUser(currentAppUser, appUser);
                }, ANIMATION_TIMINGS.PAGE_TRANSITION);
            }, ANIMATION_TIMINGS.PAGE_TRANSITION);
        }
    }

    updateUser(currentAppUser, appUser);
}

export function subscribeUser() {
    const client = getClient();
    const {user} = store.getState();
    const subscription = client.subscribe(`/v1/users/${user._id}`, handleUserSubscription);

    return subscription.then(() => {
        store.dispatch(setFayeUserSubscription(subscription));
    });
}

export function disconnectClient() {
    if (client) {
        client.disconnect();
        client = undefined;
    }
}
