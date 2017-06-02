export const SET_HAS_FOCUS = 'SET_HAS_FOCUS';
export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';

export function hasFocus(value) {
    return {
        type: SET_HAS_FOCUS,
        hasFocus: value
    };
}

export function setCurrentLocation(location) {
    return {
        type: SET_CURRENT_LOCATION,
        location
    };
}
