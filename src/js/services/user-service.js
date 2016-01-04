import { store } from 'stores/app-store';
import { core } from 'services/core';
import { setUser } from 'actions/user-actions';
import { getConversation, connectFaye } from 'services/conversation-service';

export function immediateUpdate(props) {
    const user = store.getState().user;

    // TODO : compute isDirty flag 
    let isDirty = true;

    return isDirty ? core().appUsers.update(user._id, props).then((response) => {
        store.dispatch(setUser(response.appUser));
        return response;
    }).catch((e) => {
        console.log(e)
        throw e;
    }) : Promise.resolve({
        user: user
    });
}

export function update(props) {
    // TODO : throttle request and compute state to send
    // TODO : dispatch props to store before update
    return immediateUpdateUser(props);
}

export function trackEvent(eventName, userProps) {
    const user = store.getState().user;
    return core().appUsers.trackEvent(user._id, eventName, userProps).then((response) => {
        if (response.conversationUpdated) {
            return getConversation()
                .then(connectFaye)
                .then(() => {
                    return response;
                });
        }

        return response;
    }).catch((e) => {
        console.log(e)
        throw e;
    });
}
