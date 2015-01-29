var ROOT_URL = 'https://supportkit-staging.herokuapp.com';

/**
 * The browser console
 *
 * @property console
 * @private
 * @type object
 */
window.console = window.console || {};
window.console.log = this.console.log || function() {};

/**
 * expose our sdk
 */
(function(root) {
    root.SupportKit = root.SupportKit || {};
    root.SupportKit.VERSION = "js1.0.0";
}(this));

/**
 * main sdk
 */
(function(root) {

    root.SupportKit = root.SupportKit || {};

    /**
     * Contains all SupportKit API classes and functions.
     * @name SupportKit
     * @namespace
     *
     * Contains all SupportKit API classes and functions.
     */
    var SupportKit = root.SupportKit;

    // If jQuery has been included, grab a reference to it.
    if (typeof(root.$) !== "undefined") {
        SupportKit.$ = root.$;
    }

    SupportKit.rest = function(method, path, body) {
        return $.ajax({
            url: ROOT_URL + path,
            type: "POST",
            headers: {
                'app-token': this.appToken
            },
            data: JSON.stringify(body),
            contentType: 'application/json',
            success: function(res) {
                console.log('Response:', res);
            },
            error: function(err) {
                console.error(err);
            }
        });
    };

    SupportKit.get = function(path, body) {
        return this.rest('GET', path, body);
    };

    SupportKit.post = function(path, body) {
        return this.rest('POST', path, body);
    };

    SupportKit.boot = function(options) {
        options = options || {};

        if (typeof options === 'object') {
            this.appToken = options.appToken;
        } else if (typeof options === 'string') {
            this.appToken = options;
        } else {
            throw new Error('boot method accepts an object or string');
        }

        if (!this.appToken) {
            throw new Error('boot method requires an appToken');
        }

        // TODO: Look in cookie or generate a new one
        this.deviceId = '55614f40eb66161de81a7643252825db';

        this.post('/api/appboot', {
            deviceId: this.deviceId
        });
    };
}(this));