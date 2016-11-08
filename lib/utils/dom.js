'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.waitForPage = waitForPage;
exports.preventMobilePageScroll = preventMobilePageScroll;
exports.allowMobilePageScroll = allowMobilePageScroll;
exports.monitorUrlChanges = monitorUrlChanges;
exports.stopMonitoringUrlChanges = stopMonitoringUrlChanges;
exports.monitorBrowserState = monitorBrowserState;
exports.stopMonitoringBrowserState = stopMonitoringBrowserState;
exports.getElementProperties = getElementProperties;
exports.getTop = getTop;

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _appStore = require('../stores/app-store');

var _browserActions = require('../actions/browser-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pushState = window.history && window.history.pushState;
var replaceState = window.history && window.history.replaceState;

var monitorCallback = void 0;

function waitForPage() {
    return new _promise2.default(function (resolve) {
        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                resolve();
            });
        }
    });
}

function preventMobilePageScroll() {
    var htmlEl = document.querySelector('html');
    htmlEl.classList.add('sk-widget-opened');
    if (_ismobilejs2.default.apple.device) {
        htmlEl.classList.add('sk-ios-device');
    }
}

function allowMobilePageScroll() {
    var htmlEl = document.querySelector('html');
    htmlEl.classList.remove('sk-widget-opened');
    if (_ismobilejs2.default.apple.device) {
        htmlEl.classList.remove('sk-ios-device');
    }
}

function monitorUrlChanges(callback) {
    stopMonitoringUrlChanges();

    monitorCallback = callback;
    window.addEventListener('hashchange', monitorCallback);

    if (window.history) {
        window.history.pushState = function (state, title, url) {
            for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                rest[_key - 3] = arguments[_key];
            }

            pushState && pushState.apply(window.history, [state, title, url].concat(rest));

            if (url) {
                monitorCallback();
            }
        };

        window.history.replaceState = function (state, title, url) {
            for (var _len2 = arguments.length, rest = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
                rest[_key2 - 3] = arguments[_key2];
            }

            replaceState && replaceState.apply(window.history, [state, title, url].concat(rest));

            if (url) {
                monitorCallback();
            }
        };
    }
}

function stopMonitoringUrlChanges() {
    if (monitorCallback) {
        window.removeEventListener('hashchange', monitorCallback);

        if (window.history) {
            window.history.pushState = pushState;
            window.history.replaceState = replaceState;
        }
    }
}

function onWindowFocus() {
    _appStore.store.dispatch((0, _browserActions.hasFocus)(true));
}

function onWindowBlur() {
    _appStore.store.dispatch((0, _browserActions.hasFocus)(false));
}

function monitorBrowserState() {
    _appStore.store.dispatch((0, _browserActions.hasFocus)(document.hasFocus ? document.hasFocus() : true));
    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('blur', onWindowBlur);
}

function stopMonitoringBrowserState() {
    window.removeEventListener('focus', onWindowFocus);
    window.removeEventListener('blur', onWindowBlur);
}

function getElementProperties(element) {
    var style = window.getComputedStyle(element, null);
    return {
        width: element.offsetWidth || 0,
        height: element.offsetHeight || 0,
        paddingLeft: style.getPropertyValue('padding-left'),
        paddingRight: style.getPropertyValue('padding-right'),
        fontSize: style.getPropertyValue('font-size')
    };
}

function getTop(node) {
    var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;

    var top = 0;
    if (node && node.offsetParent) {
        do {
            top += node.offsetTop;
            node = node.offsetParent;
        } while (node && node !== container);

        return top;
    }
}