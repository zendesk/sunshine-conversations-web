import { Smooch } from './smooch';

(function(root, factory) {
    console.log(root.__readyFnName)
    parent.window.__onLibReady(factory());
}(window, () => {
    return new Smooch();
}));
