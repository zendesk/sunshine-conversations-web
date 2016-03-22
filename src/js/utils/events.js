// using a symbol to avoid "discoverable" private props
const listeners = Symbol('listeners');

export class Observable {
    constructor() {
        this[listeners] = new Map();
    }

    on(event, handler) {
        const map = this[listeners];
        if (!map.has(event)) {
            map.set(event, new Set());
        }

        map.get(event).add(handler);
    }

    off(event, handler) {
        const map = this[listeners];
        if (map.has(event)) {
            if (handler) {
                map.get(event).delete(handler);
            } else {
                map.get(event).clear();
            }
        } else {
            map.clear();
        }
    }

    trigger(event, options) {
        const map = this[listeners];
        if (map.has(event)) {
            map.get(event).forEach((handler) => handler(options));
        }
    }
}

export const observable = new Observable();
