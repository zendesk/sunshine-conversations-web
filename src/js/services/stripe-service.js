import { store } from '../stores/app-store';
import { showErrorNotification } from '../actions/app-state-actions';
import { core } from './core';
import { getUserId } from './user-service';

export function createTransaction(actionId, token) {
    return core().appUsers.stripe.createTransaction(getUserId(), actionId, token).catch((e) => {
        store.dispatch(showErrorNotification(store.getState().ui.text.actionPaymentError));
        throw e;
    });
}

export function getAccount() {
    return core().stripe.getAccount();
}
