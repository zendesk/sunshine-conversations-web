import { Client } from 'faye';
import urljoin from 'urljoin';

import { store } from '../stores/app-store';
import { messageAdded } from '../actions/conversation-actions';

export function initFaye(conversationId) {
    const state = store.getState();

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

    return faye.subscribe('/conversations/' + state.conversation._id, (message) => {
        store.dispatch(addMessage({
            message: message
        }));
    });
}
