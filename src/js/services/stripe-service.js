import { store } from 'stores/app-store';
import { core } from 'services/core';

export function createTransaction(actionId, token) {
    let user = store.getState().user;
    return core().appUsers.stripe.createTransaction(user._id, actionId, token);
}
