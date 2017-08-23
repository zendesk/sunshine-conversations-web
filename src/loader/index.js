/* eslint no-empty:"off" */
(function(w, d, globalVarName, appId) {
    var initArgs;
    var onCallArgs = [];
    var renderArgs;
    var destroyArgs;
    var promiseCalls = [];
    w[globalVarName] = {
        init: function() {
            initArgs = arguments;
            var fakePromise = {
                then: function(next) {
                    promiseCalls.push({
                        type: 't',
                        next: next
                    });
                    return fakePromise;
                },
                catch: function(next) {
                    promiseCalls.push({
                        type: 'c',
                        next: next
                    });
                    return fakePromise;
                }
            };

            return fakePromise;
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

    w.__onWebMessengerHostReady__ = function onHostReady(Lib) {
        delete w.__onWebMessengerHostReady__;
        // replace skeleton with real lib
        w[globalVarName] = Lib;

        if (initArgs) {
            var promise = Lib.init.apply(Lib, initArgs);
            for (var i = 0; i < promiseCalls.length; i++) {
                var call = promiseCalls[i];

                if (call.type === 't') {
                    promise = promise.then(call.next);
                } else {
                    promise = promise.catch(call.next);
                }
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
