'use strict';

exports.__esModule = true;
exports.EDITABLE_PROPERTIES = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.immediateUpdate = immediateUpdate;
exports.update = update;
exports.trackEvent = trackEvent;
exports.updateNowViewing = updateNowViewing;
exports.getUserId = getUserId;

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _userActions = require('../actions/user-actions');

var _core = require('./core');

var _conversation = require('./conversation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var waitDelay = 5000; // ms
var pendingUserProps = {};
var pendingUpdatePromise = void 0;
var pendingResolve = void 0;
var deviceUpdateThrottle = void 0;
var deviceUpdatePending = false;
var pendingTimeout = void 0;
var lastUpdateAttempt = void 0;

var EDITABLE_PROPERTIES = exports.EDITABLE_PROPERTIES = ['givenName', 'surname', 'email', 'signedUpAt', 'properties'];

function immediateUpdate(props) {
    return function (dispatch, getState) {
        var _getState = getState(),
            user = _getState.user;

        var updateToResolve = pendingResolve;
        if (pendingTimeout) {
            clearTimeout(pendingTimeout);
            pendingTimeout = null;
            pendingResolve = null;
        }

        lastUpdateAttempt = Date.now();

        props = (0, _assign2.default)({}, pendingUserProps, props);
        pendingUserProps = {};

        var isDirty = EDITABLE_PROPERTIES.reduce(function (isDirty, prop) {
            return isDirty || !(0, _deepEqual2.default)(user[prop], props[prop]);
        }, false);

        if (isDirty) {
            return (0, _core.core)(getState()).appUsers.update(getUserId(getState()), props).then(function (response) {
                dispatch((0, _userActions.setUser)(response.appUser));
                if (updateToResolve) {
                    updateToResolve(response);
                }
                return response;
            });
        } else if (updateToResolve) {
            updateToResolve(user);
            return pendingUpdatePromise;
        } else {
            return _promise2.default.resolve({
                user: user
            });
        }
    };
}

function update(props) {
    return function (dispatch) {
        (0, _assign2.default)(pendingUserProps, props);

        var timeNow = Date.now();
        var lastUpdateTime = lastUpdateAttempt || 0;

        if (pendingTimeout) {
            return pendingUpdatePromise;
        } else if (timeNow - lastUpdateTime > waitDelay) {
            return dispatch(immediateUpdate(pendingUserProps));
        } else {
            var timeToWait = waitDelay - (timeNow - lastUpdateTime);

            pendingUpdatePromise = new _promise2.default(function (resolve) {
                pendingResolve = resolve;

                setTimeout(function () {
                    resolve(dispatch(immediateUpdate(pendingUserProps)));
                }, timeToWait);
            });

            return pendingUpdatePromise;
        }
    };
}

function trackEvent(eventName, userProps) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.trackEvent(getUserId(getState()), eventName, userProps).then(function (response) {
            if (response.conversationUpdated) {
                return dispatch((0, _conversation.handleConversationUpdated)()).then(function () {
                    return response;
                });
            }

            return response;
        });
    };
}

function updateNowViewing(deviceId) {
    return function (dispatch) {
        if (!deviceUpdateThrottle) {
            deviceUpdateThrottle = setTimeout(function () {
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
            return _promise2.default.resolve();
        }
    };
}

function immediateUpdateDevice(deviceId, device) {
    return function (dispatch, getState) {
        return (0, _core.core)(getState()).appUsers.updateDevice(getUserId(getState()), deviceId, device).then(function (response) {
            if (response.conversationUpdated) {
                return dispatch((0, _conversation.handleConversationUpdated)()).then(function () {
                    return response;
                });
            }

            return response;
        });
    };
}

function getUserId(_ref) {
    var _ref$user = _ref.user,
        _id = _ref$user._id,
        userId = _ref$user.userId;

    return userId || _id;
}