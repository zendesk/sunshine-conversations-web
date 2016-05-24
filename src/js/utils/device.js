import uuid from 'uuid';
import { storage } from 'utils/storage';

export function getDeviceId() {
    const SK_STORAGE = 'sk_deviceid';
    const deviceId = storage.getItem(SK_STORAGE) ||
    uuid.v4().replace(/-/g, '');

    storage.setItem(SK_STORAGE, deviceId);

    return deviceId;
}
