import enquire from 'enquire.js';

import { SCREEN_SIZES } from '../constants/sizes';
import { generateMediaQuery } from './dom';

const sizes = ['lg', 'md', 'sm', 'xs'];

export function init(iframe) {
    for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];

        let rules = SCREEN_SIZES[size];
        // polyfill for Array.isArray
        if (Object.prototype.toString.call(rules) !== '[object Array]') {
            rules = [rules];
        }

        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];

            enquire.register(generateMediaQuery(rule), () => {
                iframe.contentWindow.postMessage({
                    type: 'sizeChange',
                    value: size
                }, location.protocol + '//' + location.host);
            });
        }
    }
}
