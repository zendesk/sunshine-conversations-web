import { showErrorNotification } from './app-state';
import http from './http';

export function createTransaction(actionId, token) {
    return (dispatch, getState) => {
        const {config: {appId}, user: {_id}, ui} = getState();
        return dispatch(http('GET', `/client/apps/${appId}/appusers/${_id}/stripe/transaction`, {
            actionId,
            token
        })).catch((e) => {
            dispatch(showErrorNotification(ui.text.actionPaymentError));
            throw e;
        });
    };
}

export function getAccount() {
    return (dispatch, getState) => {
        const {config: {appId}, user: {_id}} = getState();
        return dispatch(http('GET', `/client/apps/${appId}/appusers/${_id}/stripe/customer`));
    };
}
