'use strict';

exports.__esModule = true;
exports.hasFocus = hasFocus;
exports.setCurrentLocation = setCurrentLocation;
var SET_HAS_FOCUS = exports.SET_HAS_FOCUS = 'SET_HAS_FOCUS';
var SET_CURRENT_LOCATION = exports.SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';

function hasFocus(value) {
    return {
        type: SET_HAS_FOCUS,
        hasFocus: value
    };
}

function setCurrentLocation(location) {
    return {
        type: SET_CURRENT_LOCATION,
        location: location
    };
}