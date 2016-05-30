import { Smooch } from 'smooch-core/lib/smooch';
import urljoin from 'urljoin';

import { VERSION } from '../constants/version';
import { store } from '../stores/app-store';

export function core() {
    const auth = store.getState().auth;
    return new Smooch(auth, {
        serviceUrl: urljoin(store.getState().appState.serverURL, 'v1'),
        headers: {
            'x-smooch-sdk': `web/${VERSION}`
        }
    });
}
