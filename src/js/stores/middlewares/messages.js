import { ADD_MESSAGE } from 'actions/conversation-actions';
import { showSettingsNotification } from 'actions/app-state-actions';


export function firstMessage(store) {
    return function(next) {
        return function(action) {
            let result = next(action);
            let state = store.getState();
            if (state.appState.settingsEnabled && action.type === ADD_MESSAGE && !state.user.email) {
                // this middleware only cares about a message being added by the user
                // and the settings are enabled and the user's email is not set

                let conversationLength = state.conversation.messages.length;

                if (conversationLength === 1) {
                    // only care about a conversation with a unique message

                    let message = state.conversation.messages[0];

                    if (message.role === 'appUser') {
                        // that message must come from the user
                        store.dispatch(showSettingsNotification());
                    }

                }
            }
            return result;
        };
    };
}
