import uuid from 'uuid';

import storage from './storage';

export function getClientId(appId) {
    const SK_STORAGE = `${appId}.clientId`;
    const deviceId = storage.getItem(SK_STORAGE) ||
    uuid.v4().replace(/-/g, '');

    storage.setItem(SK_STORAGE, deviceId);

    return deviceId;
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
