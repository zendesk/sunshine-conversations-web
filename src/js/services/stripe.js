import { showErrorNotification } from '../actions/app-state-actions';
import { core } from './core';
import { getUserId } from './user';

export function createTransaction(actionId, token) {
    return (dispatch, getState) => {
        return core(getState()).appUsers.stripe.createTransaction(getUserId(getState()), actionId, token).catch((e) => {
            dispatch(showErrorNotification(getState().ui.text.actionPaymentError));
            throw e;
        });
    };
}

export function getAccount() {
    return (dispatch, getState) => {
        return core(getState()).stripe.getAccount();
    };
}
