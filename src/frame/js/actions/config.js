import { batchActions } from 'redux-batched-actions';

import http from './http';
import { computeColorsMetadata } from '../utils/config';


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

        return dispatch(http('GET', `/client/apps/${appId}/config`, {}, {}, configBaseUrl))
            .then(({config}) => {
                const actions = Object.keys(config).map((key) => {
                    if (key === 'style') {
                        return setConfig(key, computeColorsMetadata(config[key]));
                    }

                    return setConfig(key, config[key]);
                });

                actions.push(setConfig('apiBaseUrl', config.baseUrl.web));

                dispatch(batchActions(actions));
            });
    };
}
