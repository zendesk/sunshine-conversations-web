import { core } from 'services/core';

export function login(props) {
    return core().appUsers.init(props);
}
