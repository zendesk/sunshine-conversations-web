'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _setPrototypeOf = require('babel-runtime/core-js/object/set-prototype-of');

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!global._babelPolyfill) {
    require('babel-polyfill');
}

(function () {
    // setPrototypeOf Polyfill for =< IE10

    var testObject = {};

    if (!(_setPrototypeOf2.default || testObject.__proto__)) {
        var nativeGetPrototypeOf = _getPrototypeOf2.default;

        Object.getPrototypeOf = function (object) {
            if (object.__proto__) {
                return object.__proto__;
            } else {
                return nativeGetPrototypeOf.call(Object, object);
            }
        };
    }
})();