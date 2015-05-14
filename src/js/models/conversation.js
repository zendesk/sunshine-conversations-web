'use strict';

var _ = require('underscore'),
    Backbone = require('backbone'),
    cookie = require('cookie'),
    url = require('url');

var BaseModel = require('./base-model'),
    Message = require('./message');

var vent = require('../vent');

module.exports = BaseModel.extend({
    idAttribute: '_id',

    relations: [
        {
            type: Backbone.HasMany,
            key: 'messages',
            relatedModel: Message,
            reverseRelation: {
                key: 'conversation'
            },
            collectionOptions: function(model) {
                return {
                    url: url.resolve(model.url(), '/messages/')
                };
            }
        }
    ],

    initialize: function() {
        this.unread = 0;
        this.updateUnread();
        this.on('change', this.updateUnread, this);
        vent.on('message', this.receiveMessage, this);
    },

    receiveMessage: function(message) {
        this.get('messages').add(message);

        if (!_.contains(this.get('appMakers'), message.get('authorId'))) {
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
        var latestReadTs = this.getLatestReadTime();
        var unreadMessages = this.get('messages').chain()
            .filter(function(message) {
                // Filter out own messages
                return !_.contains(this.get('appUsers'), message.get('authorId'));
            }.bind(this))
            .filter(function(message) {
                return Math.floor(message.get('received')) > latestReadTs;
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