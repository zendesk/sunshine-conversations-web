var POLLING_INTERVAL_MS = 5000;

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;
var MessageCollection = require('./messageCollection');
var Message = require('./message');
var ChatView = require('./chatView');
var endpoint = require('./endpoint');
var cookie = require('cookie');
var uuid = require('uuid');

$(function() {

    SupportKit.on('ready', function() {
        var el = $("<div/>").appendTo("body");

        var b = new ChatView({
            el: el,
            model: SupportKit.messageCollection
        });

        b.render();
    });

});



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

    // Create a conversation if one does not already exist
    SupportKit._fetchMessages = function() {
        var self = this;
        var deferred = $.Deferred();

        if (self.messageCollection) {
            deferred.resolve(self.messageCollection);
        } else {
            endpoint.getConversations()
                .then(function(conversations) {
                    if (conversations.length > 0) {
                        // A conversation already exists
                        return conversations[0];
                    }

                    // No conversation created yet, make one
                    return endpoint.post('/api/conversations', {
                        appUserId: endpoint.appUserId
                    });
                })
                .then(function(conversation) {
                    self.messageCollection = new MessageCollection();
                    self.messageCollection.conversationId = conversation._id;

                    //Begin message collcetion refresh polling
                    self.messageCollection.on('sync', function() {
                        setTimeout(function(){
                            // fetch somehow calls add on existing message too. remove:false should help but doesn't
                            self.messageCollection.fetch({remove: false});
                        }, POLLING_INTERVAL_MS);
                    });
                    return self.messageCollection.fetchPromise();
                })
                .then(function() {
                    deferred.resolve(self.messageCollection);
                });
        }

        return deferred;
    };

    SupportKit.boot = function(options) {
        this.booted = false;
        var self = this;
        options = options || {};

        if (typeof options === 'object') {
            endpoint.appToken = options.appToken;
        } else if (typeof options === 'string') {
            endpoint.appToken = options;
        } else {
            throw new Error('boot method accepts an object or string');
        }

        if (!endpoint.appToken) {
            throw new Error('boot method requires an appToken');
        }

        // TODO: Allow options to override the deviceId
        var deviceId = cookie.parse(document.cookie)['sk_deviceid'];
        if (!deviceId) {
            deviceId = uuid.v4().replace(/-/g, '');
            document.cookie = 'sk_deviceid=' + deviceId;
        }
        this.deviceId = deviceId;

        endpoint.post('/api/appboot', {
            deviceId: this.deviceId
        })
            .then(function(res) {
                var deferred = $.Deferred();
                endpoint.appUserId = res.appUserId;

                // Perform initial fetch of messages
                return self._fetchMessages();
            })
            .then(function(conversations) {
                // Tell the world we're ready
                self.booted = true;
                self.trigger('ready');
            });
    };

    SupportKit.message = function(text) {
        var self = this;
        var message;

        if (!this.booted) {
            throw new Error('Can not send messages until boot has completed');
        }

        this._fetchMessages()
            .then(function() {
                message = new Message({
                    authorId: endpoint.appUserId,
                    text: text
                });
                message.conversationId = self.messageCollection.conversationId;
                return endpoint.postMessage(message, self.messageCollection);
            })
            .then(function() {
                self.messageCollection.fetch();
                return message;
            });
    };
}(window));