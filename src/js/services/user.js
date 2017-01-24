import deepEqual from 'deep-equal';

import { setUser } from '../actions/user-actions';
import { core } from './core';
import { handleConversationUpdated } from './conversation';

let waitForSave = false;
const waitDelay = 5000; // ms
let pendingUserProps = {};
let previousValue = Promise.resolve();
let deviceUpdateThrottle;
let deviceUpdatePending = false;

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

        props = Object.assign({}, pendingUserProps, props);
        pendingUserProps = {};

        const isDirty = EDITABLE_PROPERTIES.reduce((isDirty, prop) => {
            return isDirty || !deepEqual(user[prop], props[prop]);
        }, false);

        return isDirty ? core(getState()).appUsers.update(getUserId(getState()), props).then((response) => {
            dispatch(setUser(response.appUser));
            return response;
        }) : Promise.resolve({
            user
        });
    };
}

export function update(props) {
    return (dispatch) => {
        Object.assign(pendingUserProps, props);

        if (waitForSave) {
            return previousValue;
        } else {
            previousValue = dispatch(immediateUpdate(pendingUserProps));
            waitForSave = true;

            setTimeout(() => {
                previousValue = dispatch(immediateUpdate(pendingUserProps));
                waitForSave = false;
            }, waitDelay);
        }

        return previousValue;
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
