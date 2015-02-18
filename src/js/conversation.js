var _ = require('underscore');
var Backbone = require('backbone');
var baseMethods = require('./baseMethods');
var endpoint = require('./endpoint');
var cookie = require('cookie');
var vent = require('./vent');

var Conversation = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: endpoint.rootUrl + '/api/conversations/',

    initialize: function() {
        this.unread = 0;
        this.updateUnread();
        this.on('change', this.updateUnread);
        vent.on('message', _.bind(this.receiveMessage, this));
    },

    postMessage: function(message) {
        var path = '/api/conversations/' + this.id + '/messages';
        return endpoint.post(path, message.attributes);
    },

    fetchPromise: function() {
        var deferred = $.Deferred();
        this.fetch({
            success: function(result) {
                deferred.resolve(result);
            },
            error: function(err) {
                deferred.reject(err);
            },
            // fetch somehow calls add on existing message too. remove:false should help but doesn't
            remove: false
        });

        return deferred;
    },

    receiveMessage: function(message) {
        var messageArray = _.clone(this.get('messages') || []);
        messageArray.push(message);
        this.set('messages', messageArray);

        if (!_.contains(this.get('appMakers'), message.authorId)) {
            var appMakersArray = _.clone(this.get('appMakers') || []);
            appMakersArray.push(message.authorId);
            this.set('appMakers', appMakersArray);
        }
    },

    //
    // Unread count
    // 
    getLatestReadTime: function() {
        if (!this.latestReadTs) {
            this.latestReadTs = parseInt(cookie.parse(document.cookie)['sk_latestts'] || 0);
        }
        return this.latestReadTs;
    },

    setLatestReadTime: function(ts) {
        this.latestReadTs = ts;
        document.cookie = 'sk_latestts=' + ts;
    },

    updateUnread: function() {
        var self = this;
        var latestReadTs = this.getLatestReadTime();
        var unreadMessages = _.chain(this.get('messages'))
            .filter(function(message) {
                // Filter out own messages
                return !_.contains(self.get('appUsers'), message.authorId);
            })
            .filter(function(message) {
                return Math.floor(message.received) > latestReadTs;
            })
            .value();

        if (this.unread !== unreadMessages.length) {
            this.unread = unreadMessages.length;
            this.trigger('change:unread', this.unread);
        }
    },

    resetUnread: function() {
        var latestReadTs = 0;
        var latestMessage = _.max(this.get('messages'), function(message) {
            return message.received;
        });

        if (latestMessage !== -Infinity) {
            latestReadTs = Math.floor(latestMessage.received);
        }
        this.setLatestReadTime(latestReadTs);
        this.updateUnread();
    }
});

_.extend(Conversation.prototype, baseMethods);
module.exports = Conversation;