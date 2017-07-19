import { Smooch } from 'smooch-core/lib/smooch';
import urljoin from 'urljoin';

export function core({auth, appState}) {
    return new Smooch(auth, {
        serviceUrl: urljoin(appState.serverURL, 'v1'),
        headers: {
            'x-smooch-sdk': `web/${VERSION}`
        }
    });
}
