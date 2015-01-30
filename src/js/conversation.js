var _ = require('underscore');
var Backbone = require('backbone');
var baseMethods = require('./baseMethods');
var endpoint = require('./endpoint');
var cookie = require('cookie');

var Conversation = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: endpoint.rootUrl + '/api/conversations/',

    initialize: function() {
        this.unread = 0;
        this.updateUnread();
        this.on('change', this.updateUnread);
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

    //
    // Unread count
    // 
    getLatestReadTime: function() {
        if (!this.latestReadTs) {
            this.latestReadTs = cookie.parse(document.cookie)['sk_latestts'] || 0;
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
        var unreadMessages = _.filter(this.get('messages'), function(message) {
            return message.received > latestReadTs;
        });

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
            latestReadTs = latestMessage.received;
        }

        this.trigger('change:unread', this.unread);
        this.setLatestReadTime(latestReadTs);
    }
});

_.extend(Conversation.prototype, baseMethods);
module.exports = Conversation;