export const SET_STRIPE_INFO = 'SET_STRIPE_INFO';
export const SET_PUBLIC_KEYS = 'SET_PUBLIC_KEYS';
export const SET_APP_SETTINGS = 'SET_APP_SETTINGS';
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

export function setStripeInfo(props) {
    return {
        type: SET_STRIPE_INFO,
        props
    };
}

export function setAppSettings(props = {}) {
    if (!props.web) {
        props.web = {};
    }

    return {
        type: SET_APP_SETTINGS,
        props
    };
}
