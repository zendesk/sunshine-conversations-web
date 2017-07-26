import { isDark } from '../utils/colors';
import { capitalizeFirstLetter } from '../utils/strings';

export function computeColorsMetadata(config) {
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

        if (config[key]) {
            try {
                config[metadataKey] = isDark(`#${config[key]}`);
            }
            catch (e) {
                console.warn(`Invalid value for ${key}`);
                config[metadataKey] = isDefaultDark;
            }
        } else {
            config[metadataKey] = isDefaultDark;
        }
    });

    return config;
}
