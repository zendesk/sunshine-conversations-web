import http from './http';
import { handleUserConversationResponse } from './conversation';

import { getClientId } from '../utils/client';
import { removeItem } from '../utils/storage';

export const SET_AUTH = 'SET_AUTH';
export const RESET_AUTH = 'RESET_AUTH';

export function login() {
    return (dispatch, getState) => {
        const {config: {appId}, user: {userId}, auth: {sessionToken}} = getState();
        return dispatch(http('POST', `/apps/${appId}/login`, {
            userId,
            sessionToken,
            clientId: getClientId(appId)
        })).then(({response, ...props}) => {
            // get rid of session token
            removeItem(`${appId}.sessionToken`);
            dispatch(setAuth({
                sessionToken: null
            }));

            if (response.status === 200) {
                return dispatch(handleUserConversationResponse(props));
            }
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
