import http from './http';
import { handleUserConversationResponse } from './conversation';

import { getDeviceId } from '../utils/device';

export const SET_AUTH = 'SET_AUTH';
export const RESET_AUTH = 'RESET_AUTH';

export function login() {
    return (dispatch, getState) => {
        const {config: {appId}, user: {userId}, auth: {sessionToken}} = getState();
        return dispatch(http('POST', `/apps/${appId}/login`, {
            userId,
            sessionToken,
            clientId: getDeviceId()
        })).then(({response, ...props}) => {
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
