import uuid from 'uuid';

import storage from './storage';

export function getDeviceId(appId) {
    const SK_STORAGE = `${appId}.clientId`;
    const deviceId = storage.getItem(SK_STORAGE) ||
    uuid.v4().replace(/-/g, '');

    storage.setItem(SK_STORAGE, deviceId);

    return deviceId;
}
