export const SET_HAS_FOCUS = 'SET_HAS_FOCUS';

export function hasFocus(value) {
    return {
        type: SET_HAS_FOCUS,
        hasFocus: value
    };
}
