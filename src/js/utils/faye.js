import { Client } from 'faye';
import urljoin from 'urljoin';

import { store } from 'stores/app-store';
import { addMessage, incrementUnreadCount } from 'actions/conversation-actions';
import { getConversation } from 'services/conversation-service';

export function initFaye() {
    const state = store.getState();

    if (!state.faye.subscription) {
        var faye = new Client(urljoin(state.appState.serverURL, 'faye'));

        faye.addExtension({
            outgoing: (message, callback) => {
                if (message.channel === '/meta/subscribe') {
                    message.appUserId = state.user._id;

                    if (state.auth.appToken) {
                        message.appToken = state.auth.appToken;
                    }

                    if (state.auth.jwt) {
                        message.jwt = state.auth.jwt;
                    }
                }

                callback(message);
            }
        });

        faye.on('transport:up', function() {
            const user = store.getState().user;

            if (user.conversationStarted) {
                getConversation();
            }
        });

        return faye.subscribe(`/v1/conversations/${state.conversation._id}`, (message) => {
            store.dispatch(addMessage(message));
            if (message.role !== 'appUser') {
                store.dispatch(incrementUnreadCount());
            }
        });
    }
}
