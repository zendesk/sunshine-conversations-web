"use strict";

exports.__esModule = true;
exports.Throttle = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var Throttle = exports.Throttle = function () {
    function Throttle() {
        var waitMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;
        (0, _classCallCheck3.default)(this, Throttle);

        this.waitMs = waitMs;
        this.throttled;
        this.promise;
    }

    Throttle.prototype.exec = function exec(func) {
        var _this = this;

        if (this.throttled) {
            return this.promise;
        }

        this.throttled = true;
        setTimeout(function () {
            return _this.throttled = false;
        }, this.waitMs);

        this.promise = func();
        return this.promise;
    };

    return Throttle;
}();

;