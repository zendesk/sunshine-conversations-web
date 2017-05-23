import { Smooch } from './smooch';

(function(root, factory) {
    /* global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return (root.Smooch = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Smooch = factory();
    }
}(global, () => {
    return new Smooch();
}));
