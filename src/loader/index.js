(function(w, d, globalVarName, appId) {
    var initArgs;
    var onCallArgs = [];
    var next;
    var globalVar = w[globalVarName] = {
        init: function() {
            initArgs = arguments;
            return {
                then: function(_next) {
                    next = _next;
                }
            };
        },
        on: function() {
            onCallArgs.push(arguments);
        }
    };

    // Polyfill for Object.assign from MDN
    function objectAssign(target, varArgs) {
        if (target == null) { // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        // keep the original context if it's a function
                        if (typeof nextSource[nextKey] === 'function') {
                            to[nextKey] = nextSource[nextKey].bind(nextSource);
                        } else {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
        }
        return to;
    }

    w.__onSmoochHostReady__ = function onHostReady(Lib) {
        delete w.__onSmoochHostReady__;
        // hydrate skeleton with all the stuff from the real lib
        objectAssign(globalVar, Lib);
        if (initArgs) {
            var initCall = Lib.init.apply(Lib, initArgs);
            if (next) {
                initCall.then(next);
            }
        }

        for (var i = 0; i < onCallArgs.length; i++) {
            Lib.on.apply(Lib, onCallArgs[i]);
        }
    };

    function onLoad() {
        try {
            if (this.response.url) {
                var firstTag = d.getElementsByTagName('script')[0];
                var tag = d.createElement('script');

                tag.async = true;
                tag.src = this.response.url;
                firstTag.parentNode.insertBefore(tag, firstTag);
            }
        }
        catch (e) {}
    }

    // let's make a request to know which version of the lib to load
    var req = new XMLHttpRequest();
    req.addEventListener('load', onLoad);
    req.open('GET', 'https://' + appId + '.webloader.smooch.io/', true);
    req.responseType = 'json';
    req.send();
})(window, document, 'Smooch', '<APPID>');
