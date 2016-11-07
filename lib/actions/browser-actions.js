'use strict';

exports.__esModule = true;
exports.hasFocus = hasFocus;
var SET_HAS_FOCUS = exports.SET_HAS_FOCUS = 'SET_HAS_FOCUS';

function hasFocus(value) {
    return {
        type: SET_HAS_FOCUS,
        hasFocus: value
    };
}