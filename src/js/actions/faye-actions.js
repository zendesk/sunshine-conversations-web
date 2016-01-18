export const SET_FAYE_SUBSCRIPTION = 'SET_FAYE_SUBSCRIPTION';
export const UNSET_FAYE_SUBSCRIPTION = 'UNSET_FAYE_SUBSCRIPTION';

export function setFayeSubscription(subscription) {
    return {
        type: SET_FAYE_SUBSCRIPTION,
        subscription: subscription
    };
}


export function unsetFayeSubscription() {
    return {
        type: UNSET_FAYE_SUBSCRIPTION
    };
}
