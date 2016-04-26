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
            // use setTimeout to execute the handler after the current
            // execution stack is cleared. That way, any hooks won't block the
            // widget execution
            map.get(event).forEach((handler) => setTimeout(handler(options)));
        }
    }
}

export const observable = new Observable();

export function observeStore(store, select, onChange) {
    let currentState;

    function handleChange() {
        const nextState = select(store.getState());
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    const unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
}

export function preventDefault(e) {
    e.preventDefault();
}
