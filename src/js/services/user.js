import deepEqual from 'deep-equal';

import { setUser } from '../actions/user-actions';
import { core } from './core';
import { handleConversationUpdated } from './conversation';

function Deferred(Promise) {
    if (Promise == null) {
        Promise = global.Promise;
    }
    if (this instanceof Deferred) {
        return defer(Promise, this);
    } else {
        return defer(Promise, Object.create(Deferred.prototype));
    }
}

function defer(Promise, deferred) {
    deferred.promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
}

const waitDelay = 10000; // ms
let pendingUserProps = {};
let pendingUpdate;
let deviceUpdateThrottle;
let deviceUpdatePending = false;
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
        const {user} = getState();

        const updateToResolve = pendingUpdate;
        if (pendingTimeout) {
            clearTimeout(pendingTimeout);
            pendingTimeout = null;
            pendingUpdate = null;
        }

        lastUpdateAttempt = Date.now();

        props = Object.assign({}, pendingUserProps, props);
        console.log(props);
        pendingUserProps = {};

        const isDirty = EDITABLE_PROPERTIES.reduce((isDirty, prop) => {
            return isDirty || !deepEqual(user[prop], props[prop]);
        }, false);

        if (isDirty) {
            return core(getState()).appUsers.update(getUserId(getState()), props).then((response) => {
                dispatch(setUser(response.appUser));
                if (updateToResolve) {
                    updateToResolve.resolve(response);
                }
                return response;
            });
        } else if (updateToResolve) {
            updateToResolve.resolve(user);
            return updateToResolve.promise;
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
            return pendingUpdate.promise;
        } else if ((timeNow - lastUpdateTime) > waitDelay) {
            return dispatch(immediateUpdate(pendingUserProps));
        } else {
            const timeToWait = waitDelay - (timeNow - lastUpdateTime);

            pendingUpdate = new Deferred();
            pendingTimeout = setTimeout(() => {
                dispatch(immediateUpdate(pendingUserProps));
            }, timeToWait);

            return pendingUpdate.promise;
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
