const memoryStorage = {};

export function setItem(key, value) {
    try {
        if (localStorage) {
            // Safari with privacy options will have localStorage
            // but won't let us write to it.
            localStorage.setItem(key, value);
        } else {
            // Android WebView might not have localStorage at all.
            memoryStorage[key] = value;
        }
    }
    catch (err) {
        memoryStorage[key] = value;
    }
}

export function getItem(key) {
    let value;

    if (localStorage) {
        value = localStorage.getItem(key) || memoryStorage[key];
    } else {
        value = memoryStorage[key];
    }

    // per localStorage spec, it returns null when not found
    return value || null;
}

export function removeItem(key) {
    localStorage && localStorage.removeItem(key);
    delete memoryStorage[key];
}
