import { Smooch } from './smooch';

(function(root, factory) {
    root.__onLibReady(factory());
}(global, () => {
    return new Smooch();
}));
