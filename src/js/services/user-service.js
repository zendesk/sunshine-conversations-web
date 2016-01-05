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
        console.error(e)
        throw e;
    }) : Promise.resolve({
        user: user
    });
}

let waitForSave = false;
const waitDelay = 5000; // ms
let computedUserProps = {};
let previousValue = Promise.resolve();

export function update(props) {
    Object.assign(computedUserProps, props);

    if (waitForSave) {
        return previousValue;
    } else {
        previousValue = immediateUpdate(computedUserProps);
        waitForSave = true;
        computedUserProps = {};

        setTimeout(() => {
            waitForSave = false;
        }, waitDelay);
    }

    return previousValue;
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
