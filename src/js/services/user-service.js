import { store } from '../stores/app-store';
import { core } from './core';

export function immediateUpdate(props) {
    const state = store.getState();
    return core().appUsers.update(state.user._id, props).catch((e) => console.log(e));
}

export function update(props) {
    // TODO : throttle request
    return immediateUpdateUser(props);
}
