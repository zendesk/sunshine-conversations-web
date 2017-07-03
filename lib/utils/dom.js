'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.waitForPage = waitForPage;
exports.preventMobilePageScroll = preventMobilePageScroll;
exports.allowMobilePageScroll = allowMobilePageScroll;
exports.monitorUrlChanges = monitorUrlChanges;
exports.stopMonitoringUrlChanges = stopMonitoringUrlChanges;
exports.getWindowLocation = getWindowLocation;
exports.monitorBrowserState = monitorBrowserState;
exports.stopMonitoringBrowserState = stopMonitoringBrowserState;
exports.getElementProperties = getElementProperties;
exports.getTop = getTop;
exports.getBoundingRect = getBoundingRect;

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

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

function getWindowLocation() {
    return window.location;
}

var onWindowFocus = void 0;
var onWindowBlur = void 0;

function monitorBrowserState(dispatch) {
    if (!onWindowFocus) {
        onWindowFocus = function onWindowFocus() {
            dispatch((0, _browserActions.hasFocus)(true));
        };
    }

    if (!onWindowBlur) {
        onWindowBlur = function onWindowBlur() {
            dispatch((0, _browserActions.hasFocus)(false));
        };
    }

    dispatch((0, _browserActions.hasFocus)(document.hasFocus ? document.hasFocus() : true));
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

function getBoundingRect(element) {
    var style = window.getComputedStyle(element, null);
    var margin = {
        left: parseInt(style['margin-left']) || 0,
        right: parseInt(style['margin-right']) || 0,
        top: parseInt(style['margin-top']) || 0,
        bottom: parseInt(style['margin-bottom']) || 0
    };
    var padding = {
        left: parseInt(style['padding-left']) || 0,
        right: parseInt(style['padding-right']) || 0,
        top: parseInt(style['padding-top']) || 0,
        bottom: parseInt(style['padding-bottom']) || 0
    };
    var border = {
        left: parseInt(style['border-left']) || 0,
        right: parseInt(style['border-right']) || 0,
        top: parseInt(style['border-top']) || 0,
        bottom: parseInt(style['border-bottom']) || 0
    };

    var rect = element.getBoundingClientRect();

    rect = {
        left: rect.left - margin.left,
        right: rect.right - margin.right - padding.left - padding.right,
        top: rect.top - margin.top,
        bottom: rect.bottom - margin.bottom - padding.top - padding.bottom - border.bottom
    };
    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;
    return rect;
}