export const SET_USER = 'SET_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const RESET_USER = 'RESET_USER';

export function setUser(props) {
    return {
        type: SET_USER,
        user: props
    };
}

export function updateUser(properties) {
    return {
        type: UPDATE_USER,
        properties
    };
}

export function resetUser() {
    return {
        type: RESET_USER
    };
}
