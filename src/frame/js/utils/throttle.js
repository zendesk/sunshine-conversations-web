
/**
 * Throttle for functions that return a promise. If additional calls are made
 * while the throttle is on, the original promise will be returned.
 *
 * Usage:
 *
 * const func = () => Promise.resolve('foo')
 *
 * const throttle = new Throttle();
 * const throttledFunc = () => throttle.exec(() => func());
 * throttledFunc().then((foo) => {})
 */
export class Throttle {
    constructor(waitMs = 5000) {
        this.waitMs = waitMs;
        this.throttled;
        this.promise;
    }

    exec(func) {
        if (this.throttled) {
            return this.promise;
        }

        this.throttled = true;
        setTimeout(() => this.throttled = false, this.waitMs);

        this.promise = func();
        return this.promise;
    }
};
