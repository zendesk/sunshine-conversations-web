export const SET_APP = 'SET_APP';
export const SET_STRIPE_INFO = 'SET_STRIPE_INFO';
export const RESET_APP = 'RESET_APP';

export function resetApp() {
    return {
        type: RESET_APP
    };
}

export function setApp(app) {
    return {
        type: SET_APP,
        app
    };
}


export function setStripeInfo(props) {
    return {
        type: SET_STRIPE_INFO,
        props
    };
}
