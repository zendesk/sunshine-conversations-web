'use strict';

var _ = require('underscore'),
    Backbone = require('backbone'),
    cookie = require('cookie'),
    urljoin = require('url-join');

var BaseModel = require('./base-model'),
    Messages = require('../collections/messages');

var vent = require('../vent'),
    endpoint = require('../endpoint');

module.exports = BaseModel.extend({
    idAttribute: '_id',
    urlRoot: urljoin(endpoint.rootUrl, 'api/conversations/'),

    defaults: function() {
        return {
            unread: 0,
            messages: [],
            appMakers: []
        };
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'messages',
            collectionType: function() {
                var model = this;
                return Messages.extend({
                    url: function() {
                        return urljoin(model.url(), '/messages/')
                    }
                })
            }
        }
    ],

    initialize: function() {
        this.updateUnread();
        this.listenTo(this.get('messages'), 'add', this.updateUnread);
        this.listenTo(vent, 'receive:message', this.receiveMessage);
    },

    receiveMessage: function(message) {
        message = this.get('messages').add(message);

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
            this.set('unread', unreadMessages.length);
        }
    },

    resetUnread: function() {
        var latestReadTs = 0;
        var latestMessage = this.get('messages').max(function(message) {
            return message.get('received');
        });

        if (latestMessage !== -Infinity) {
            latestReadTs = Math.floor(latestMessage.get('received'));
        }
        this.setLatestReadTime(latestReadTs);
        this.updateUnread();
    }
});