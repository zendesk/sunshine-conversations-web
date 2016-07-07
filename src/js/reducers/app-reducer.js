import Color from 'color';

import { SET_STRIPE_INFO, RESET_APP, SET_APP } from '../actions/app-actions';
import { RESET } from '../actions/common-actions';

const INITIAL_STATE = {
    integrations: [],
    settings: {
        web: {
            channels: {}
        }
    }
};

function filterIntegrations(integrations, channelSettings) {
    // check for !== false because we also want it to be true if the key is not in channelSettings
    return integrations.filter(({platform}) => channelSettings[platform] !== false);
}

function computeColorsMetadata(settings) {
    const metadata = {};

    [{
        key: 'brandingColor',
        isDefaultDark: false
    }, {
        key: 'accentColor',
        isDefaultDark: true
    }, {
        key: 'linkColor',
        isDefaultDark: true
    }].forEach(({key, isDefaultDark}) => {
        if (settings[key]) {
            try {
                const color = Color(`#${settings[key]}`);
                metadata[`${key}Dark`] = color.dark();
            }
            catch (e) {
                console.warn(`Invalid ${key}`);
                metadata[`${key}Dark`] = isDefaultDark;
            }
        } else {
            metadata[`${key}Dark`] = isDefaultDark;
        }
    });
    return metadata;
}

export function AppReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case RESET_APP:
            return {
                ...INITIAL_STATE
            };

        case SET_APP:
            return {
                ...action.app,
                settings: {
                    web: {
                        ...action.app.settings.web,
                        ...computeColorsMetadata(action.app.settings.web)
                    }
                },
                integrations: filterIntegrations(action.app.integrations, action.app.settings.web)
            };

        case SET_STRIPE_INFO:
            return {
                ...state,
                stripe: action.props
            };

        default:
            return state;
    }
}
