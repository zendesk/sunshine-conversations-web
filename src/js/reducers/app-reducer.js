import { SET_STRIPE_INFO, RESET_APP, SET_APP } from '../actions/app-actions';
import { RESET } from '../actions/common-actions';
import { isDark } from '../utils/colors';
import { capitalizeFirstLetter } from '../utils/strings';

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
        key: 'brandColor',
        isDefaultDark: true
    }, {
        key: 'accentColor',
        isDefaultDark: true
    }, {
        key: 'linkColor',
        isDefaultDark: true
    }].forEach(({key, isDefaultDark}) => {
        const metadataKey = `is${capitalizeFirstLetter(key)}Dark`;

        if (settings[key]) {
            try {
                metadata[metadataKey] = isDark(`#${settings[key]}`);
            }
            catch (e) {
                console.warn(`Invalid value for ${key}`);
                metadata[metadataKey] = isDefaultDark;
            }
        } else {
            metadata[metadataKey] = isDefaultDark;
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
                    ...action.app.settings,
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
