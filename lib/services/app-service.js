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

var _appStore = require('../stores/app-store');

var _appStateActions = require('../actions/app-state-actions');

var AppStateActions = _interopRequireWildcard(_appStateActions);

var _dom = require('../utils/dom');

var _conversationService = require('./conversation-service');

var _events = require('../utils/events');

var _user = require('../utils/user');

var _app = require('../utils/app');

var _channels = require('../constants/channels');

var _app2 = require('../constants/app');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function openWidget() {
    var embedded = _appStore.store.getState().appState.embedded;

    if (!embedded) {
        _appStore.store.dispatch(AppStateActions.openWidget());
        _events.observable.trigger('widget:opened');
        (0, _conversationService.resetUnreadCount)();
        (0, _dom.preventMobilePageScroll)();
    }
}

function closeWidget() {
    var embedded = _appStore.store.getState().appState.embedded;

    if (!embedded) {
        _appStore.store.dispatch(AppStateActions.closeWidget());
        _events.observable.trigger('widget:closed');
        (0, _conversationService.resetUnreadCount)();
        (0, _dom.allowMobilePageScroll)();
    }
}

function toggleWidget() {
    var _store$getState$appSt = _appStore.store.getState().appState,
        embedded = _store$getState$appSt.embedded,
        widgetState = _store$getState$appSt.widgetState;

    if (!embedded) {
        if (widgetState === _app2.WIDGET_STATE.OPENED) {
            closeWidget();
        } else {
            openWidget();
        }
    }
}

function connectToFayeUser() {
    var _store$getState = _appStore.store.getState(),
        _store$getState$app = _store$getState.app,
        appChannels = _store$getState$app.integrations,
        settings = _store$getState$app.settings,
        clients = _store$getState.user.clients;

    if ((0, _user.hasLinkableChannels)(appChannels, clients, settings.web)) {
        return (0, _conversationService.connectFayeUser)();
    }

    return _promise2.default.resolve();
}

function showSettings() {
    _appStore.store.dispatch(AppStateActions.showSettings());
    return connectToFayeUser();
}

function hideSettings() {
    _appStore.store.dispatch(AppStateActions.hideSettings());
}

function showChannelPage(channelType) {
    var _store$getState2 = _appStore.store.getState(),
        user = _store$getState2.user,
        integrations = _store$getState2.app.integrations;

    var channelDetails = _channels.CHANNEL_DETAILS[channelType];
    var isLinked = (0, _user.isChannelLinked)(user.clients, channelType);
    var openLink = channelDetails.getURL && (!channelDetails.Component || isLinked);

    if (openLink) {
        var appChannel = (0, _app.getIntegration)(integrations, channelType);
        var link = channelDetails.getURL(user, appChannel, isLinked);

        if (link) {
            window.open(link);
            return isLinked || !channelDetails.isLinkable ? _promise2.default.resolve() : connectToFayeUser();
        }
    }

    _appStore.store.dispatch(AppStateActions.showChannelPage(channelType));

    return connectToFayeUser().then(function () {
        channelDetails.onChannelPage();
    });
}

function hideChannelPage() {
    _appStore.store.dispatch(AppStateActions.hideChannelPage());
}

function showConnectNotification() {
    _appStore.store.dispatch(AppStateActions.showConnectNotification(Date.now() / 1000.0));
}

function hideConnectNotification() {
    _appStore.store.dispatch(AppStateActions.hideConnectNotification());
}

function showTypingIndicator(data) {
    var typingIndicatorTimeoutId = _appStore.store.getState().appState.typingIndicatorTimeoutId;

    if (typingIndicatorTimeoutId) {
        clearTimeout(typingIndicatorTimeoutId);
    }

    var timeoutId = setTimeout(function () {
        hideTypingIndicator();
    }, 10 * 1000);

    _appStore.store.dispatch(AppStateActions.showTypingIndicator((0, _extends3.default)({}, data, {
        timeoutId: timeoutId
    })));
}

function hideTypingIndicator() {
    var typingIndicatorTimeoutId = _appStore.store.getState().appState.typingIndicatorTimeoutId;

    if (typingIndicatorTimeoutId) {
        clearTimeout(typingIndicatorTimeoutId);
    }

    _appStore.store.dispatch(AppStateActions.hideTypingIndicator());
}