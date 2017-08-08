import { batchActions } from 'redux-batched-actions';

import http from './http';
import { resetConversation, handleUserConversationResponse, disconnectFaye } from './conversation';
import { setUser, resetUser } from './user';

import { getClientId, getClientInfo } from '../utils/client';
import { removeItem } from '../utils/storage';

export const SET_AUTH = 'SET_AUTH';
export const RESET_AUTH = 'RESET_AUTH';

export function login(userId, jwt) {
    return (dispatch, getState) => {
        const {config: {appId}, auth: {sessionToken}} = getState();

        const actions = [
            setAuth({
                jwt
            }),
            setUser({
                userId
            }),
            resetConversation()
        ];

        dispatch(disconnectFaye());
        dispatch(batchActions(actions));

        return dispatch(http('POST', `/apps/${appId}/login`, {
            userId,
            sessionToken,
            client: getClientInfo(appId)
        })).then((response) => {
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
                resetConversation()
            ];

            dispatch(disconnectFaye());
            dispatch(batchActions(actions));

            removeItem(`${appId}.appUserId`);
            removeItem(`${appId}.sessionToken`);
        });
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
