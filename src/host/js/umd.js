import Smooch from './smooch';

(function(root, factory) {
    /* global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory();
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        // in this case, the host lib must be used in conjunction with
        // the script loader
        if(root.__onSmoochHostReady__) {
            root.__onSmoochHostReady__(factory());
        } else {
            console.error('Script loader not found. Please check out the setup instructions.');
        }
    }
}(global, () => {
    return Smooch;
}));
