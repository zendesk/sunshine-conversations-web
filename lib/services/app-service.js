'use strict';

exports.__esModule = true;
exports.openWidget = openWidget;
exports.closeWidget = closeWidget;
exports.toggleWidget = toggleWidget;

var _appStore = require('../stores/app-store');

var _appStateActions = require('../actions/app-state-actions');

var AppStateActions = _interopRequireWildcard(_appStateActions);

var _events = require('../utils/events');

var _dom = require('../utils/dom');

var _conversationService = require('./conversation-service');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
    var _store$getState$appSt = _appStore.store.getState().appState;

    var embedded = _store$getState$appSt.embedded;
    var widgetOpened = _store$getState$appSt.widgetOpened;

    if (!embedded) {
        if (widgetOpened) {
            closeWidget();
        } else {
            openWidget();
        }
    }
}