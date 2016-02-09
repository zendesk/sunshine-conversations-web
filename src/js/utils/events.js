// using a symbol to avoid "discoverable" private props
const listeners = Symbol('listeners');

export class Observable {
    constructor() {
        this[listeners] = new Map();
    }

    on(event, handler) {
        let map = this[listeners];
        if (!map.has(event)) {
            map.set(event, new Set());
        }

        map.get(event).add(handler);
    }

    off(event, handler) {
        let map = this[listeners];
        if (map.has(event)) {
            map.get(event).delete(handler);
        }
    }

    trigger(event, options) {
        let map = this[listeners];
        if (map.has(event)) {
            map.get(event).forEach(handler => handler(options));
        }
    }
}

export const observable = new Observable();
