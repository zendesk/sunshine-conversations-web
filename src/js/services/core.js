import { Smooch } from 'smooch-core/lib/smooch';
import { store } from 'stores/app-store';
import urljoin from 'urljoin';

export function core() {
    const auth = store.getState().auth;
    return new Smooch(auth, {
        serviceUrl: urljoin(store.getState().appState.serverURL, 'v1'),
        headers: {
            'x-smooch-sdk': `web/${VERSION}`
        }
    });
}
