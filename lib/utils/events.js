'use strict';

exports.__esModule = true;
exports.observable = exports.Observable = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

exports.observeStore = observeStore;
exports.preventDefault = preventDefault;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// using a symbol to avoid "discoverable" private props
var listeners = (0, _symbol2.default)('listeners');

var Observable = exports.Observable = function () {
    function Observable() {
        (0, _classCallCheck3.default)(this, Observable);

        this[listeners] = new _map2.default();
    }

    Observable.prototype.on = function on(event, handler) {
        var map = this[listeners];
        if (!map.has(event)) {
            map.set(event, new _set2.default());
        }

        map.get(event).add(handler);
    };

    Observable.prototype.off = function off(event, handler) {
        var map = this[listeners];
        if (map.has(event)) {
            if (handler) {
                map.get(event).delete(handler);
            } else {
                map.get(event).clear();
            }
        } else {
            map.clear();
        }
    };

    Observable.prototype.trigger = function trigger(event, options) {
        var map = this[listeners];
        if (map.has(event)) {
            // use setTimeout to execute the handler after the current
            // execution stack is cleared. That way, any hooks won't block the
            // widget execution
            map.get(event).forEach(function (handler) {
                return setTimeout(function () {
                    return handler(options);
                }, 0);
            });
        }
    };

    return Observable;
}();

var observable = exports.observable = new Observable();

function observeStore(store, select, onChange) {
    var currentState = void 0;

    function handleChange() {
        var nextState = select(store.getState());
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    var unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
}

function preventDefault(e) {
    e.preventDefault();
}