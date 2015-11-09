import Smooch from 'smooch-core';
import { store } from '../stores/app-store';
import urljoin from 'urljoin';

export function core() {
    return new Smooch(urljoin(store.getState().appState.serverURL, 'v1'));
}
