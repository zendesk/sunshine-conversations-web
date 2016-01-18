import { store } from 'stores/app-store';
import { core } from 'services/core';

import { setUser } from 'actions/user-actions';

export function login(props) {
    return core().appUsers.init(props);
}
