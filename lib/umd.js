'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _smooch = require('./smooch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (root, factory) {
    /* global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return root.Smooch = factory();
        });
    } else if ((typeof module === 'undefined' ? 'undefined' : (0, _typeof3.default)(module)) === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Smooch = factory();
    }
})(global, function () {
    return new _smooch.Smooch();
});