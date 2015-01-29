var ROOT_URL = 'https://supportkit-staging.herokuapp.com';
var POLLING_INTERVAL_MS = 5000;

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;
var ConversationCollection = require('./conversationCollection');
var MessageCollection = require('./messageCollection');

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

    // Imbue SupportKit with trigger and on powers
    _.extend(SupportKit, Backbone.Events);

    // If jQuery has been included, grab a reference to it.
    if (typeof(root.$) !== "undefined") {
        SupportKit.$ = root.$;
    }

    SupportKit._rest = function(method, path, body) {
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

    SupportKit._get = function(path, body) {
        return this._rest('GET', path, body);
    };

    SupportKit._post = function(path, body) {
        return this._rest('POST', path, body);
    };

    // Create a conversation if one does not already exist
    SupportKit._fetchMessages = function() {
        var self = this;
        var deferred = $.Deferred();

        if (!self.messageCollection) {
            return this._post('/api/conversations', {
                    appUserId: this.appUserId
                })
                .then(function(response) {
                    self.messageCollection = new MessageCollection({
                        baseUrl: ROOT_URL,
                        appToken: self.appToken,
                        appUserId: self.appUserId
                    });
                    self.messageCollection.conversationId = response._id;

                    // TODO: begin refresh polling
                    // self.messageCollection.on('sync', function() {
                    //     setTimeout(_.bind(self.messageCollection.fetch, self.messageCollection), POLLING_INTERVAL_MS);
                    // });
                    return self.messageCollection.fetchPromise();
                })
                .then(function() {
                    deferred.resolve(self.messageCollection);
                });
        } else {
            deferred.resolve(self.messageCollection);
        }

        return deferred;
    };

    SupportKit.boot = function(options) {
        this.booted = false;
        var self = this;
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
        this.deviceId = '75614f40eb66161de81a7643252825db';

        this._post('/api/appboot', {
            deviceId: this.deviceId
        })
            .then(function(res) {
                var deferred = $.Deferred();
                self.appUserId = res.appUserId;

                // Create message collection
                self.conversations = new ConversationCollection({
                    baseUrl: ROOT_URL,
                    appToken: self.appToken,
                    appUserId: self.appUserId
                });

                return self.conversations.fetchPromise();
            })
            .then(function(conversations) {
                // Tell the world we're ready
                self.booted = true;
                self.trigger('ready');

                //TOOD: If there is a conversation, start a polling loop
            });
    };

    SupportKit.message = function(text) {
        var self = this;
        if (!this.booted) {
            throw new Error('Can not send messages until boot has completed');
        }

        this._fetchMessages()
            .then(function() {
                console.log('>>> Got message collection:', self.messageCollection);
            });
    };
}(window));