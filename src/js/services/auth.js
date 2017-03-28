import { core } from './core';

export function login(props) {
    return (dispatch, getState) => {
        return core(getState()).appUsers.init(props);
    };
}
