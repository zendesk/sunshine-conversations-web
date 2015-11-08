import { store } from '../stores/app-store';
import { core } from './core';

export function login(props) {
    const authState = store.getState().auth;
    return core.appUsers.init(props, authState.auth).catch((e) => console.log(e));
}
