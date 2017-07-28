import deepEqual from 'deep-equal';

import http from './http';


export const SET_USER = 'SET_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const RESET_USER = 'RESET_USER';

const waitDelay = 5000; // ms
let pendingUserProps = {};
let pendingUpdatePromise;
let pendingResolve;
let pendingTimeout;
let lastUpdateAttempt;

export const EDITABLE_PROPERTIES = [
    'givenName',
    'surname',
    'email',
    'signedUpAt',
    'properties'
];

export function immediateUpdate(props) {
    return (dispatch, getState) => {
        const {config: {appId}, user} = getState();

        const updateToResolve = pendingResolve;
        if (pendingTimeout) {
            clearTimeout(pendingTimeout);
            pendingTimeout = null;
            pendingResolve = null;
        }

        lastUpdateAttempt = Date.now();

        props = Object.assign({}, pendingUserProps, props);
        pendingUserProps = {};

        const isDirty = EDITABLE_PROPERTIES.reduce((isDirty, prop) => {
            return isDirty || !deepEqual(user[prop], props[prop]);
        }, false);

        if (isDirty) {
            return dispatch(http('PUT', `/apps/${appId}/appusers/${user._id}`, props))
                .then((response) => {
                    dispatch(setUser(response.appUser));
                    if (updateToResolve) {
                        updateToResolve(response);
                    }
                    return response;
                });
        } else if (updateToResolve) {
            updateToResolve(user);
            return pendingUpdatePromise;
        } else {
            return Promise.resolve({
                user
            });
        }
    };
}

export function update(props) {
    return (dispatch) => {
        Object.assign(pendingUserProps, props);

        const timeNow = Date.now();
        const lastUpdateTime = lastUpdateAttempt || 0;

        if (pendingTimeout) {
            return pendingUpdatePromise;
        } else if ((timeNow - lastUpdateTime) > waitDelay) {
            return dispatch(immediateUpdate(pendingUserProps));
        } else {
            const timeToWait = waitDelay - (timeNow - lastUpdateTime);

            pendingUpdatePromise = new Promise(function(resolve) {
                pendingResolve = resolve;

                setTimeout(() => {
                    resolve(dispatch(immediateUpdate(pendingUserProps)));
                }, timeToWait);
            });

            return pendingUpdatePromise;
        }
    };
}

export function setUser(props) {
    return {
        type: SET_USER,
        user: props
    };
}

export function updateUser(properties) {
    return {
        type: UPDATE_USER,
        properties
    };
}

export function resetUser() {
    return {
        type: RESET_USER
    };
}
