import { store } from '../stores/app-store';
import { core } from './core';

import { setUser } from '../actions/user-actions';

export function login(props) {
    const auth = store.getState().auth;
    return core().appUsers.init(props, auth).catch((e) => console.log(e));
}
