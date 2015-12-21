import { store } from 'stores/app-store';
import { core } from 'services/core';
import { setUser } from 'actions/user-actions';

export function immediateUpdate(props) {
    const user = store.getState().user;
    return core().appUsers.update(user._id, props).then((response) => {
        store.dispatch(setUser(props.appUser));
        return response;
    }).catch((e) => console.log(e));
}

export function update(props) {
    // TODO : throttle request and compute state to send
    // TODO : dispatch props to store before update
    return immediateUpdateUser(props);
}

export function trackEvent(eventName, userProps) {
    const user = store.getState().user;
    return core().appUsers.trackEvent(user._id, eventName, userProps).catch((e) => console.log(e));
}
