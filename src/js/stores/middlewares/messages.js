import { ADD_MESSAGE } from 'actions/conversation-actions';
import { showSettingsNotification } from 'actions/app-state-actions';


export function firstMessage(store) {
    return function(next) {
        return function(action) {
            let result = next(action);
            let state = store.getState();
            if (state.appState.settingsEnabled && action.type === ADD_MESSAGE && action.message.role === 'appUser' && !state.user.email) {
                // this middleware only cares about a message being added by the user
                // and the settings are enabled and the user's email is not set

                let appUserMessageCount = state.conversation.messages.filter(message => message.role === 'appUser').length;

                if (appUserMessageCount === 1) {
                    // should only be one message from the app user
                    store.dispatch(showSettingsNotification());
                }
            }
            return result;
        };
    };
}
