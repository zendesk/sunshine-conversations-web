import isMobile from 'ismobilejs';

import { hasFocus } from '../actions/browser-actions';

const pushState = window.history && window.history.pushState;
const replaceState = window.history && window.history.replaceState;

let monitorCallback;

export function waitForPage() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                resolve();
            });
        }
    });
}

export function preventMobilePageScroll() {
    const htmlEl = document.querySelector('html');
    htmlEl.classList.add('sk-widget-opened');
    if (isMobile.apple.device) {
        htmlEl.classList.add('sk-ios-device');
    }
}

export function allowMobilePageScroll() {
    const htmlEl = document.querySelector('html');
    htmlEl.classList.remove('sk-widget-opened');
    if (isMobile.apple.device) {
        htmlEl.classList.remove('sk-ios-device');
    }
}

export function monitorUrlChanges(callback) {
    stopMonitoringUrlChanges();

    monitorCallback = callback;
    window.addEventListener('hashchange', monitorCallback);

    if (window.history) {
        window.history.pushState = (state, title, url, ...rest) => {
            pushState && pushState.apply(window.history, [state, title, url, ...rest]);

            if (url) {
                monitorCallback();
            }
        };

        window.history.replaceState = (state, title, url, ...rest) => {
            replaceState && replaceState.apply(window.history, [state, title, url, ...rest]);

            if (url) {
                monitorCallback();
            }
        };
    }
}

export function stopMonitoringUrlChanges() {
    if (monitorCallback) {
        window.removeEventListener('hashchange', monitorCallback);

        if (window.history) {
            window.history.pushState = pushState;
            window.history.replaceState = replaceState;
        }
    }
}

export function getWindowLocation() {
    return window.location;
}


let onWindowFocus;
let onWindowBlur;

export function monitorBrowserState(dispatch) {
    if (!onWindowFocus) {
        onWindowFocus = function onWindowFocus() {
            dispatch(hasFocus(true));
        };
    }

    if (!onWindowBlur) {
        onWindowBlur = function onWindowBlur() {
            dispatch(hasFocus(false));
        };
    }

    dispatch(hasFocus(document.hasFocus ? document.hasFocus() : true));
    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('blur', onWindowBlur);
}

export function stopMonitoringBrowserState() {
    window.removeEventListener('focus', onWindowFocus);
    window.removeEventListener('blur', onWindowBlur);
}

export function getElementProperties(element) {
    const style = window.getComputedStyle(element, null);
    return {
        width: element.offsetWidth || 0,
        height: element.offsetHeight || 0,
        paddingLeft: style.getPropertyValue('padding-left'),
        paddingRight: style.getPropertyValue('padding-right'),
        fontSize: style.getPropertyValue('font-size')
    };
}

export function getTop(node, container = document.body) {
    let top = 0;
    if (node && node.offsetParent) {
        do {
            top += node.offsetTop;
            node = node.offsetParent;
        } while (node && node !== container);

        return top;
    }
}

export function getBoundingRect(element) {
    const style = window.getComputedStyle(element, null);
    const margin = {
        left: parseInt(style['margin-left']) || 0,
        right: parseInt(style['margin-right']) || 0,
        top: parseInt(style['margin-top']) || 0,
        bottom: parseInt(style['margin-bottom']) || 0
    };
    const padding = {
        left: parseInt(style['padding-left']) || 0,
        right: parseInt(style['padding-right']) || 0,
        top: parseInt(style['padding-top']) || 0,
        bottom: parseInt(style['padding-bottom']) || 0
    };
    const border = {
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
