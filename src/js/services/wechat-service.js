import { store } from '../stores/app-store';
import { core } from './core';

export function getQRCode() {
    const user = store.getState().user;
    return core().appUsers.wechat.getQRCode(user._id);
}
