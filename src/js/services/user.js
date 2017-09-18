import deepEqual from 'deep-equal';

import { setUser } from '../actions/user-actions';
import { core } from './core';
import { handleConversationUpdated } from './conversation';

const waitDelay = 5000; // ms
let pendingUserProps = {};
let pendingUpdatePromise;
let pendingResolve;
let deviceUpdateThrottle;
let deviceUpdatePending = false;
let pendingTimeout;
let lastUpdateAttempt;

export const EDITABLE_PROPERTIES = [
    'givenName',
    'surname',
    'email',
    'signedUpAt',
    'properties',
    'headerColor'
];

export function immediateUpdate(props) {
    return (dispatch, getState) => {
        const {user} = getState();

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
            return core(getState()).appUsers.update(getUserId(getState()), props).then((response) => {
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

export function trackEvent(eventName, userProps) {
    return (dispatch, getState) => {
        return core(getState()).appUsers.trackEvent(getUserId(getState()), eventName, userProps).then((response) => {
            if (response.conversationUpdated) {
                return dispatch(handleConversationUpdated())
                    .then(() => {
                        return response;
                    });
            }

            return response;
        });
    };
}

export function updateNowViewing(deviceId) {
    return (dispatch) => {
        if (!deviceUpdateThrottle) {
            deviceUpdateThrottle = setTimeout(() => {
                deviceUpdateThrottle = null;

                if (deviceUpdatePending) {
                    dispatch(updateNowViewing(deviceId));
                    deviceUpdatePending = false;
                }
            }, waitDelay);

            return dispatch(immediateUpdateDevice(deviceId, {
                info: {
                    currentUrl: document.location.href,
                    currentTitle: document.title
                }
            }));
        } else {
            deviceUpdatePending = true;
            return Promise.resolve();
        }
    };
}

function immediateUpdateDevice(deviceId, device) {
    return (dispatch, getState) => {
        return core(getState()).appUsers.updateDevice(getUserId(getState()), deviceId, device).then((response) => {
            if (response.conversationUpdated) {
                return dispatch(handleConversationUpdated())
                    .then(() => {
                        return response;
                    });
            }

            return response;
        });
    };
}

export function getUserId({user: {_id, userId}}) {
    return userId || _id;
}
