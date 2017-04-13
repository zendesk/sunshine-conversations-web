'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.openWidget = openWidget;
exports.closeWidget = closeWidget;
exports.toggleWidget = toggleWidget;
exports.showSettings = showSettings;
exports.hideSettings = hideSettings;
exports.showChannelPage = showChannelPage;
exports.hideChannelPage = hideChannelPage;
exports.showConnectNotification = showConnectNotification;
exports.hideConnectNotification = hideConnectNotification;
exports.showTypingIndicator = showTypingIndicator;
exports.hideTypingIndicator = hideTypingIndicator;

var _appStateActions = require('../actions/app-state-actions');

var AppStateActions = _interopRequireWildcard(_appStateActions);

var _dom = require('../utils/dom');

var _conversation = require('./conversation');

var _integrations = require('./integrations');

var _events = require('../utils/events');

var _user = require('../utils/user');

var _app = require('../utils/app');

var _channels = require('../constants/channels');

var _app2 = require('../constants/app');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function openWidget() {
    return function (dispatch, getState) {
        var embedded = getState().appState.embedded;

        if (!embedded) {
            dispatch(AppStateActions.openWidget());
            _events.observable.trigger('widget:opened');
            dispatch((0, _conversation.resetUnreadCount)());
            (0, _dom.preventMobilePageScroll)();
        }
    };
}

function closeWidget() {
    return function (dispatch, getState) {
        var embedded = getState().appState.embedded;

        if (!embedded) {
            dispatch(AppStateActions.closeWidget());
            _events.observable.trigger('widget:closed');
            dispatch((0, _conversation.resetUnreadCount)());
            (0, _dom.allowMobilePageScroll)();
        }
    };
}

function toggleWidget() {
    return function (dispatch, getState) {
        var _getState$appState = getState().appState,
            embedded = _getState$appState.embedded,
            widgetState = _getState$appState.widgetState;

        if (!embedded) {
            if (widgetState === _app2.WIDGET_STATE.OPENED) {
                return dispatch(closeWidget());
            }
            return dispatch(openWidget());
        }
    };
}

function connectToFayeUser() {
    return function (dispatch, getState) {
        var _getState = getState(),
            _getState$app = _getState.app,
            appChannels = _getState$app.integrations,
            settings = _getState$app.settings,
            clients = _getState.user.clients;

        if ((0, _user.hasLinkableChannels)(appChannels, clients, settings.web)) {
            return dispatch((0, _conversation.connectFayeUser)());
        }

        return _promise2.default.resolve();
    };
}

function showSettings() {
    return function (dispatch) {
        dispatch(AppStateActions.showSettings());
        return dispatch(connectToFayeUser());
    };
}

function hideSettings() {
    return function (dispatch) {
        dispatch(AppStateActions.hideSettings());
    };
}

function showChannelPage(channelType) {
    return function (dispatch, getState) {
        var _getState2 = getState(),
            user = _getState2.user,
            integrations = _getState2.app.integrations;

        var channelDetails = _channels.CHANNEL_DETAILS[channelType];
        var isLinked = (0, _user.isChannelLinked)(user.clients, channelType);
        var appChannel = (0, _app.getIntegration)(integrations, channelType);
        var url = channelDetails.getURL(appChannel);
        var openLink = url && (!channelDetails.Component || isLinked);

        if (openLink) {
            window.open(url);
            if (!isLinked && channelDetails.isLinkable) {
                return dispatch(connectToFayeUser());
            }
        } else {
            dispatch(AppStateActions.showChannelPage(channelType));
            return dispatch(connectToFayeUser()).then(function () {
                return dispatch(channelDetails.onChannelPage());
            });
        }
    };
}

function hideChannelPage() {
    return function (dispatch) {
        dispatch(AppStateActions.hideChannelPage());
    };
}

function showConnectNotification() {
    return function (dispatch) {
        dispatch(AppStateActions.showConnectNotification(Date.now() / 1000.0));
    };
}

function hideConnectNotification() {
    return function (dispatch) {
        dispatch(AppStateActions.hideConnectNotification());
    };
}

function showTypingIndicator(data) {
    return function (dispatch, getState) {
        var typingIndicatorTimeoutId = getState().appState.typingIndicatorTimeoutId;


        if (typingIndicatorTimeoutId) {
            clearTimeout(typingIndicatorTimeoutId);
        }

        var timeoutId = setTimeout(function () {
            dispatch(hideTypingIndicator());
        }, 10 * 1000);

        dispatch(AppStateActions.showTypingIndicator((0, _extends3.default)({}, data, {
            timeoutId: timeoutId
        })));
    };
}

function hideTypingIndicator() {
    return function (dispatch, getState) {
        var typingIndicatorTimeoutId = getState().appState.typingIndicatorTimeoutId;


        if (typingIndicatorTimeoutId) {
            clearTimeout(typingIndicatorTimeoutId);
        }

        dispatch(AppStateActions.hideTypingIndicator());
    };
}