var Backbone = require('backbone');
var _ = require('underscore');
var jQuery = require('jquery');
Backbone.$ = jQuery;
var Conversation = require('./conversation');
var Message = require('./message');
var endpoint = require('./endpoint');
var cookie = require('cookie');
var uuid = require('uuid');

var faye = require('./faye');

var SupportKit = {
    'version': '1.0.1'
};

/**
 * expose our sdk
 */
(function(root) {
    root.SupportKit = root.SupportKit || {};
    root.SupportKit.VERSION = "js" + SupportKit.version;
}(window));

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
    if (typeof (root.jQuery) !== "undefined") {
        SupportKit.jQuery = root.jQuery;
    }

    // Create a conversation if one does not already exist
    SupportKit._fetchMessages = function() {
        var self = this;
        var deferred = jQuery.Deferred();

        if (self.conversation.isNew()) {
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
                    self.conversation.set('_id', conversation._id);
                    return self.conversation.fetchPromise();
                })
                .then(function() {
                    faye.init(self.conversation.id);
                    deferred.resolve(self.conversation);
                });
        } else {
            deferred.resolve(self.conversation);
        }

        return deferred;
    };

    SupportKit._updateUser = function() {
        if (_.isEmpty(this.user)) {
            return jQuery.Deferred().resolve();
        } else {
            this.user.properties = this.user.properties || {};
            return endpoint.put('/api/appusers/' + endpoint.appUserId, this.user);
        }
    };

    SupportKit.init = function(options) {
        this.inited = false;
        var self = this;
        options = options || {};

        this.conversation = new Conversation();
        this.user = _.pick(options, 'givenName', 'surname', 'email', 'properties');

        if (typeof options === 'object') {
            endpoint.appToken = options.appToken;
        } else if (typeof options === 'string') {
            endpoint.appToken = options;
        } else {
            throw new Error('init method accepts an object or string');
        }

        if (!endpoint.appToken) {
            throw new Error('init method requires an appToken');
        }

        // TODO: Allow options to override the deviceId
        var deviceId = cookie.parse(document.cookie)['sk_deviceid'];
        if (!deviceId) {
            deviceId = uuid.v4().replace(/-/g, '');
            document.cookie = 'sk_deviceid=' + deviceId;
        }
        this.deviceId = deviceId;

        endpoint.post('/api/appboot', {
            deviceId: this.deviceId,
            deviceInfo: {
                URL: document.location.host,
                userAgent: navigator.userAgent
            }
        })
            .then(function(res) {
                var deferred = jQuery.Deferred();
                endpoint.appUserId = res.appUserId;

                // Perform initial fetch of messages and update user profile info
                if (res.conversationStarted) {
                    return jQuery.when(self._fetchMessages.call(self), self._updateUser.call(self));
                } else {
                    return jQuery.when(self._updateUser.call(self));
                }
            })
            .then(function() {
                // Tell the world we're ready
                self.inited = true;
                self.trigger('ready');
            });
    };

    SupportKit.resetUnread = function() {
        this.conversation.resetUnread();
    };

    SupportKit.message = function(text) {
        var self = this;
        var message;

        if (!this.inited) {
            throw new Error('Can not send messages until init has completed');
        }

        this._fetchMessages()
            .then(function() {
                message = new Message({
                    authorId: endpoint.appUserId,
                    text: text
                });
                return self.conversation.postMessage(message);
            })
            .then(function() {
                self.conversation.fetch();
                return message;
            });
    };
}(window));


module.exports = window.SupportKit;