// Rewrite the loaders to avoid the style-loader used in the host part
import hostStyles from '!css-loader?modules!less-loader!../../../host/stylesheets/iframe.less';
import { hasFocus } from '../actions/browser';
import { WIDGET_STATE } from '../constants/app';
import { DISPLAY_STYLE } from '../constants/styles';

const parentDocument = parent.document;

const STATE_CLASSNAMES = {
    [WIDGET_STATE.OPENED]: hostStyles.locals.widgetOpened,
    [WIDGET_STATE.CLOSED]: hostStyles.locals.widgetClosed,
    [WIDGET_STATE.EMBEDDED]: hostStyles.locals.widgetEmbedded,
};

const DISPLAY_STYLE_CLASSNAMES = {
    [DISPLAY_STYLE.BUTTON]: hostStyles.locals.displayButton,
    [DISPLAY_STYLE.TAB]: hostStyles.locals.displayTab
};

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


export function updateHostClassNames(widgetState, displayStyle) {
    const stateClassName = STATE_CLASSNAMES[widgetState];

    const htmlEl = parentDocument.querySelector('html');
    if (stateClassName) {
        htmlEl.classList.add(stateClassName);
    }

    Object
        .getOwnPropertySymbols(STATE_CLASSNAMES)
        .map((k) => STATE_CLASSNAMES[k])
        .filter((className) => className !== stateClassName)
        .forEach((className) => htmlEl.classList.remove(className));

    if (displayStyle === DISPLAY_STYLE.BUTTON) {
        htmlEl.classList.add(DISPLAY_STYLE_CLASSNAMES[DISPLAY_STYLE.BUTTON]);
        htmlEl.classList.remove(DISPLAY_STYLE_CLASSNAMES[DISPLAY_STYLE.TAB]);
    } else {
        htmlEl.classList.add(DISPLAY_STYLE_CLASSNAMES[DISPLAY_STYLE.TAB]);
        htmlEl.classList.remove(DISPLAY_STYLE_CLASSNAMES[DISPLAY_STYLE.BUTTON]);
    }
}


export function getWindowLocation() {
    return parent.location;
}

export function hasGeolocationSupport() {
    return 'geolocation' in navigator;
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

    dispatch(hasFocus(parentDocument.hasFocus ? parentDocument.hasFocus() : true));
    parent.addEventListener('focus', onWindowFocus);
    parent.addEventListener('blur', onWindowBlur);
}

export function stopMonitoringBrowserState() {
    parent.removeEventListener('focus', onWindowFocus);
    parent.removeEventListener('blur', onWindowBlur);
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
