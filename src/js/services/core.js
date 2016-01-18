import Smooch from 'smooch-core';
import { store } from 'stores/app-store';
import urljoin from 'urljoin';

export function core() {
    const auth = store.getState().auth;
    return new Smooch(auth, urljoin(store.getState().appState.serverURL, 'v1'));
}
