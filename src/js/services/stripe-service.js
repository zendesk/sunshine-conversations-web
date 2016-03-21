import { store } from 'stores/app-store';
import { core } from 'services/core';
import { showErrorNotification } from 'actions/app-state-actions';

export function createTransaction(actionId, token) {
    const user = store.getState().user;
    return core().appUsers.stripe.createTransaction(user._id, actionId, token).catch((e) => {
        store.dispatch(showErrorNotification(store.getState().ui.text.actionPaymentError));
        throw e;
    });
}

export function getAccount() {
    return core().stripe.getAccount();
}
