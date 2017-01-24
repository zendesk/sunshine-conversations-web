'use strict';

exports.__esModule = true;
exports.EDITABLE_PROPERTIES = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var waitForSave = false;
var waitDelay = 5000; // ms
var pendingUserProps = {};
var previousValue = _promise2.default.resolve();
var deviceUpdateThrottle = void 0;
var deviceUpdatePending = false;

var EDITABLE_PROPERTIES = exports.EDITABLE_PROPERTIES = ['givenName', 'surname', 'email', 'signedUpAt', 'properties'];

function immediateUpdate(props) {
    return function (dispatch, getState) {
        var _getState = getState(),
            user = _getState.user;

        props = (0, _assign2.default)({}, pendingUserProps, props);
        pendingUserProps = {};

        var isDirty = EDITABLE_PROPERTIES.reduce(function (isDirty, prop) {
            return isDirty || !(0, _deepEqual2.default)(user[prop], props[prop]);
        }, false);

        return isDirty ? (0, _core.core)(getState()).appUsers.update(getUserId(getState()), props).then(function (response) {
            dispatch((0, _userActions.setUser)(response.appUser));
            return response;
        }) : _promise2.default.resolve({
            user: user
        });
    };
}

function update(props) {
    return function (dispatch) {
        (0, _assign2.default)(pendingUserProps, props);

        if (waitForSave) {
            return previousValue;
        } else {
            previousValue = dispatch(immediateUpdate(pendingUserProps));
            waitForSave = true;

            setTimeout(function () {
                previousValue = dispatch(immediateUpdate(pendingUserProps));
                waitForSave = false;
            }, waitDelay);
        }

        return previousValue;
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