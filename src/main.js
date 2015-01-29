var ROOT_URL = 'https://supportkit-staging.herokuapp.com';

var Backbone = require("backbone");
var $ = require('jquery');
Backbone.$ = $;
require("./texthelper");

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
        var deferred = $.Deferred();
        $.ajax({
            url: ROOT_URL + path,
            type: "POST",
            headers: {
                'app-token': this.appToken
            },
            data: JSON.stringify(body),
            contentType: 'application/json',
            success: function(res) {
                deferred.resolve(res);
            },
            error: function(err) {
                deferred.reject(err);
            }
        });
        return deferred;
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
        })
            .then(function(res) {
                console.log('Res!', res);
            });
    };
}(window));