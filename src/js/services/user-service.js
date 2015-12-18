import { store } from 'stores/app-store';
import { core } from 'services/core';

export function immediateUpdate(props) {
    const user = store.getState().user;
    return core().appUsers.update(user._id, props).catch((e) => console.log(e));
}

export function update(props) {
    // TODO : throttle request and compute state to send
    return immediateUpdateUser(props);
}

export function trackEvent(eventName, userProps) {
    const user = store.getState().user;
    return core().appUsers.trackEvent(user._id, eventName, userProps).catch((e) => console.log(e));
}
