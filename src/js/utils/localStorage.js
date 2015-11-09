'use strict';

var memoryStorage = {};

function setItem(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (err) {
        console.warn('Smooch local storage warn: localStorage not available; falling back on memory storage');
        memoryStorage[key] = value;
    }
}

function getItem(key) {
    return localStorage.getItem(key) || memoryStorage[key];
}

function removeItem(key) {
    localStorage.removeItem(key);
    delete memoryStorage[key];
}

module.exports = {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
};
