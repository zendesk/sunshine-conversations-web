'use strict';

var $ = require('jquery'),
    Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore'),
    cookie = require('cookie'),
    bindAll = require('lodash.bindall');

var ViewController = require('view-controller');

var endpoint = require('../endpoint'),
    vent = require('../vent'),
    faye = require('../faye');

var ChatView = require('../views/chatView'),
    HeaderView = require('../views/headerView'),
    ConversationView = require('../views/conversationView');

var ChatInputController = require('../controllers/chatInputController');

module.exports = ViewController.extend({
    viewClass: ChatView,

    viewEvents: {
        focus: '_resetUnread'
    },

    initialize: function() {
        bindAll(this);
    },

    open: function() {
        this.view.open();
    },

    close: function() {
        this.view.close();
        this._resetUnread();
    },

    toggle: function() {
        this.view.toggle();
    },

    sendMessage: function(text) {
        if (!!this.conversation) {
            return this.conversation.get('messages').create({
                authorId: endpoint.appUserId,
                text: text
            });
        }
    },

    _receiveMessage: function(message) {
        if (!!this.conversation) {

            // we actually need to extract the appMakers first
            // since the message rendering is done on message add event
            // and some UI stuff is relying on the appMakers collection
            if (!this.conversation.get('appMakers').get(message.authorId)) {
                this.conversation.get('appMakers').add({
                    id: message.authorId
                });
            }

            this.conversation.get('messages').add(message);
        }
    },

    _getConversation: function() {
        var deferred = $.Deferred();

        if (!!this.conversation) {
            deferred.resolve(this.conversation);
        } else if (this.collection.length > 0) {
            this.conversation = this.collection.at(0);
            deferred.resolve(this.conversation);
        } else {
            this.conversation = this.collection.create(
            {
                appUserId: endpoint.appUserId
            },
            {
                success: deferred.resolve,
                error: deferred.reject
            }
            );
        }

        return deferred;
    },

    _initFaye: function(conversation) {
        faye.init(conversation.id);
        return conversation;
    },

    _initMessagingBus: function(conversation) {
        this.listenTo(vent, 'receive:message', this._receiveMessage);
        return conversation;
    },

    _manageUnread: function(conversation) {
        this._updateUnread();
        this.listenTo(conversation.get('messages'), 'add', this._updateUnread);
        return conversation;
    },

    _renderWidget: function(conversation) {
        this.model = conversation;

        this.headerView = new HeaderView({
            model: conversation
        });

        this.listenTo(this.headerView, 'toggle', this.toggle);

        this.conversationView = new ConversationView({
            model: conversation,
            collection: conversation.get('messages'),
            childViewOptions: {
                conversation: conversation
            }
        });

        this.chatInputController = new ChatInputController({
            model: conversation,
            collection: conversation.get('messages')
        });

        this.listenTo(this.chatInputController, 'message:send', this.sendMessage);
        this.listenTo(this.chatInputController, 'message:read', this._resetUnread);

        this.view.header.show(this.headerView);
        this.view.main.show(this.conversationView);
        this.view.footer.show(this.chatInputController.getView());
    },

    getWidget: function() {
        var view = this.getView();

        // this a workaround for rendering layout views and fixing regions
        // https://github.com/marionettejs/backbone.marionette/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+layout+render
        view.render()._reInitializeRegions();

        return this.collection.fetch()
            .then(this._getConversation)
            .then(this._initFaye)
            .then(this._initMessagingBus)
            .then(this._manageUnread)
            .then(this._renderWidget)
            .then(function() {
                return view;
            });
    },


    _getLatestReadTime: function() {
        if (!this.latestReadTs) {
            this.latestReadTs = parseInt(cookie.parse(document.cookie)['sk_latestts'] || 0);
        }
        return this.latestReadTs;
    },

    _setLatestReadTime: function(ts) {
        this.latestReadTs = ts;
        document.cookie = 'sk_latestts=' + ts;
    },

    _updateUnread: function() {
        var latestReadTs = this._getLatestReadTime();
        var unreadMessages = this.conversation.get('messages').chain()
            .filter(function(message) {
                // Filter out own messages
                return !this.conversation.get('appUsers').get(message.get('authorId'));
            }.bind(this))
            .filter(function(message) {
                return Math.floor(message.get('received')) > latestReadTs;
            })
            .value();

        if (this.unread !== unreadMessages.length) {
            this.conversation.set('unread', unreadMessages.length);
        }
    },

    _resetUnread: function() {
        var latestReadTs = 0;
        var latestMessage = this.conversation.get('messages').max(function(message) {
            return message.get('received');
        });

        if (latestMessage !== -Infinity) {
            latestReadTs = Math.floor(latestMessage.get('received'));
        }
        this._setLatestReadTime(latestReadTs);
        this._updateUnread();
    }
});
