import { batchActions } from 'redux-batched-actions';

import http from './http';
import { resetConversation, handleUserConversationResponse, disconnectFaye } from './conversation';
import { setUser, resetUser, immediateUpdate as immediateUpdateUser } from './user';
import { resetIntegrations } from './integrations';

import { getClientId, getClientInfo } from '../utils/client';
import { removeItem } from '../utils/storage';

export const SET_AUTH = 'SET_AUTH';
export const RESET_AUTH = 'RESET_AUTH';

export function login(userId, jwt) {
    return (dispatch, getState) => {
        const {config: {appId}, auth: {sessionToken}, user: {_id}} = getState();

        // force update the current user before logging in another one
        const promise = _id ? dispatch(immediateUpdateUser()) : Promise.resolve();

        return promise.then(() => {
            const actions = [
                setAuth({
                    jwt
                }),
                setUser({
                    userId
                }),
                resetConversation(),
                resetIntegrations()
            ];

            dispatch(disconnectFaye());
            dispatch(batchActions(actions));

            return dispatch(http('POST', `/apps/${appId}/login`, {
                appUserId: _id,
                userId,
                sessionToken,
                client: getClientInfo(appId)
            }));
        }).then((response) => {
            // get rid of session token
            removeItem(`${appId}.sessionToken`);

            if (response && Object.keys(response).length > 0) {
                return dispatch(handleUserConversationResponse(response));
            }
        });
    };
}

export function logout() {
    return (dispatch, getState) => {
        const {config: {appId}, user: {_id: appUserId, userId}} = getState();

        if (!userId) {
            return Promise.resolve();
        }

        let promise;
        if (appUserId) {
            promise = dispatch(http('POST', `/apps/${appId}/appusers/${appUserId}/logout`, {
                client: {
                    id: getClientId(appId)
                }
            }));
        } else {
            promise = Promise.resolve();
        }

        return promise.then(() => {
            const actions = [
                resetAuth(),
                resetUser(),
                resetConversation(),
                resetIntegrations()
            ];

            dispatch(disconnectFaye());
            dispatch(batchActions(actions));

            removeItem(`${appId}.appUserId`);
            removeItem(`${appId}.sessionToken`);
        });
    };
}

export function upgradeUser(clientId) {
    return (dispatch, getState) => {
        const {config: {appId}} = getState();
        return dispatch(http('POST', `/apps/${appId}/appusers/upgrade`, {
            clientId
        }))
            .then((response) => response && response.appUser);
    };
}

export function setAuth(props) {
    return {
        type: SET_AUTH,
        ...props
    };
}

export function resetAuth() {
    return {
        type: RESET_AUTH
    };
}
