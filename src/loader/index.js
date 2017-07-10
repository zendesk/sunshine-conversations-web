/* eslint no-empty:"off" */
(function(w, d, globalVarName, appId) {
    var initArgs;
    var onCallArgs = [];
    var renderArgs;
    var destroyArgs;
    var next;
    w[globalVarName] = {
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
        },
        render: function() {
            renderArgs = arguments;
        },
        destroy: function() {
            destroyArgs = arguments;
        }
    };

    w.__onSmoochHostReady__ = function onHostReady(Lib) {
        delete w.__onSmoochHostReady__;
        // hydrate skeleton with all the stuff from the real lib
        w[globalVarName] = Lib;

        if (initArgs) {
            var initCall = Lib.init.apply(Lib, initArgs);
            if (next) {
                initCall.then(next);
            }
        }

        if (renderArgs) {
            Lib.render.apply(Lib, renderArgs);
        }

        if (destroyArgs) {
            Lib.destroy.apply(Lib, destroyArgs);
        }

        for (var i = 0; i < onCallArgs.length; i++) {
            Lib.on.apply(Lib, onCallArgs[i]);
        }
    };

    function onLoad() {
        try {
            var data;

            if (typeof this.response === 'string') {
                // IE10 doesn't care about `responseType = 'json'` and returns
                // text anyway
                data = JSON.parse(this.response);
            } else {
                data = this.response;
            }

            if (data.url) {
                var firstTag = d.getElementsByTagName('script')[0];
                var tag = d.createElement('script');

                tag.async = true;
                tag.src = data.url;
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
})(window, document, 'Smooch', '<app-id>');
