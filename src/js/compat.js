'use strict';

// Browser compatibility hurdles

// Enable CORS for IE8
window.$.support.cors = true;

// Polyfill Object.getPrototypeOf
// http://ejohn.org/blog/objectgetprototypeof/
if (typeof Object.getPrototypeOf !== 'function') {
    if (typeof 'test'.__proto__ === 'object') {
        Object.getPrototypeOf = function(object) {
            return object.__proto__;
        };
    } else {
        Object.getPrototypeOf = function(object) {
            // May break if the constructor has been tampered with
            return object.constructor.prototype;
        };
    }
}
