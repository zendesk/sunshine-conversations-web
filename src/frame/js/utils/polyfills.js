require('babel-polyfill');
export function setUp() {
    const promise = global.fetch ?
        Promise.resolve() :
        System.import('whatwg-fetch');

    if (!(Object.setPrototypeOf || {}.__proto__)) {
        const nativeGetPrototypeOf = Object.getPrototypeOf;

        Object.getPrototypeOf = function(object) {
            if (object.__proto__) {
                return object.__proto__;
            } else {
                return nativeGetPrototypeOf.call(Object, object);
            }
        };
    }

    return promise;
}
