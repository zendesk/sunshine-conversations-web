export const SET_PUBLIC_KEYS = 'SET_PUBLIC_KEYS';
export const RESET_APP = 'RESET_APP';

export function setPublicKeys(keys = {}) {
    return {
        type: SET_PUBLIC_KEYS,
        keys
    };
}

export function resetApp() {
    return {
        type: RESET_APP
    };
}
