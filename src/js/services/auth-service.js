import { core } from './core';

export function login(props) {
    return core().appUsers.init(props);
}
