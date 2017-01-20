'use strict';

exports.__esModule = true;
var memoryStorage = {};

function setItem(key, value) {
    try {
        if (localStorage) {
            // Safari with privacy options will have localStorage
            // but won't let us write to it.
            localStorage.setItem(key, value);
        } else {
            // Android WebView might not have localStorage at all.
            memoryStorage[key] = value;
        }
    } catch (err) {
        console.warn('Smooch local storage warn: localStorage not available; falling back on memory storage'); //eslint-disable-line no-console
        memoryStorage[key] = value;
    }
}

function getItem(key) {
    var value = void 0;

    if (localStorage) {
        value = localStorage.getItem(key) || memoryStorage[key];
    } else {
        value = memoryStorage[key];
    }

    // per localStorage spec, it returns null when not found
    return value || null;
}

function removeItem(key) {
    localStorage && localStorage.removeItem(key);
    delete memoryStorage[key];
}

var storage = exports.storage = {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
};