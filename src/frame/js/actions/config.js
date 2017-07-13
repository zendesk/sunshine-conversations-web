import urljoin from 'urljoin';
import { batchActions } from 'redux-batched-actions';

import http from '../utils/http';


export const SET_CONFIG = 'SET_CONFIG';
export const RESET_CONFIG = 'RESET_CONFIG';

export function setConfig(key, value) {
    return {
        type: SET_CONFIG,
        key,
        value
    };
}

export function resetConfig() {
    return {
        type: RESET_CONFIG
    };
}

export function fetchConfig() {
    return (dispatch, getState) => {
        const {configBaseUrl, appId} = getState().config;

        const configUrl = urljoin(configBaseUrl, `/client/apps/${appId}/config`);

        return http('GET', configUrl)
            .then(({config}) => {
                const actions = Object.keys(config).map((key) => {
                    return setConfig(key, config[key]);
                });

                actions.push(setConfig('apiBaseUrl', config.baseUrl.web));

                dispatch(batchActions(actions));
            });
    };
}
