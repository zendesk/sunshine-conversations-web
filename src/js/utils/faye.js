import { Client } from 'faye';
import urljoin from 'urljoin';

import { observable } from 'utils/events';
import { store } from 'stores/app-store';
import { addMessage, incrementUnreadCount } from 'actions/conversation-actions';

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

        return faye.subscribe('/conversations/' + state.conversation._id, (message) => {
            store.dispatch(addMessage(message));
            store.dispatch(incrementUnreadCount());
            observable.trigger('message:received', message);
        });
    }
}
