const memoryStorage = {};

function setItem(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (err) {
        console.warn('Smooch local storage warn: localStorage not available; falling back on memory storage'); //eslint-disable-line no-console
        memoryStorage[key] = value;
    }
}

function getItem(key) {
    const value = localStorage.getItem(key) || memoryStorage[key];

    // per localStorage spec, it returns null when not found
    return value || null;
}

function removeItem(key) {
    localStorage.removeItem(key);
    delete memoryStorage[key];
}

export const storage = {
    setItem,
    getItem,
    removeItem
};
