import uuid from 'uuid';

import * as storage from './storage';

export function getLegacyClientId() {
    return storage.getItem('sk_deviceid');
}

export function upgradeLegacyClientId(appId) {
    const legacyId = getLegacyClientId();
    if (legacyId) {
        storage.setItem(`${appId}.clientId`, legacyId);
        storage.removeItem('sk_deviceid');
    }
}

export function getClientId(appId) {
    const SK_STORAGE = `${appId}.clientId`;

    const legacyId = getLegacyClientId();
    if (legacyId) {
        return legacyId;
    }

    const clientId = storage.getItem(SK_STORAGE) ||
    uuid.v4().replace(/-/g, '');

    storage.setItem(SK_STORAGE, clientId);

    return clientId;
}

export function getClientInfo(appId) {
    return {
        platform: 'web',
        id: getClientId(appId),
        info: {
            sdkVersion: VERSION,
            URL: parent.document.location.host,
            userAgent: navigator.userAgent,
            referrer: parent.document.referrer,
            browserLanguage: navigator.language,
            currentUrl: parent.document.location.href,
            currentTitle: parent.document.title
        }
    };
}
