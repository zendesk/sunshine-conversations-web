'use strict';

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore'),
    cookie = require('cookie');

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
        render: 'onViewRender',
        focus: 'resetUnread'
    },

    open: function() {
        this.view.open();
    },

    close: function() {
        this.view.close();
    },

    toggle: function() {
        this.view.toggle();
    },

    _receiveMessage: function(message) {
        if (!!this.conversation) {
            message = this.get('messages').add(message);

            if (!_.contains(this.get('appMakers'), message.get('authorId'))) {
                var appMakersArray = _.clone(this.get('appMakers') || []);
                appMakersArray.push(message.authorId);
                this.set('appMakers', appMakersArray);
            }
        }
    },

    sendMessage: function(text) {
        if (!!this.conversation) {
            return this.conversation.get('messages').create({
                authorId: endpoint.appUserId,
                text: text
            });
        }
    },

    onViewRender: function() {
        this.collection.fetch()
            .then(function getConversation() {
                this.conversation = this.collection
                    ? this.collection.at(0)
                    : this.collection.create({
                        appUserId: endpoint.appUserId
                    }, {
                            wait: true
                        });

                return this.conversation;
            }.bind(this))
            .then(function initFaye(conversation) {
                faye.init(conversation.id);
                return conversation;
            }.bind(this))
            .then(function initMessagingBus(conversation) {
                // do it here instead of in `initialize` to make sure the conversation
                // is fetched and real.
                this.listenTo(vent, 'receive:message', this._receiveMessage);
                return conversation;
            }.bind(this))
            .then(function manageUnread(conversation) {
                this.updateUnread();
                this.listenTo(conversation.get('messages'), 'add', this.updateUnread);
                return conversation;
            }.bind(this))
            .then(function(conversation) {
                this.model = conversation;

                this.headerView = new HeaderView({
                    el: this.view.ui.header,
                    model: conversation
                });

                this.listenTo(this.headerView, 'toggle', this.toggle);

                this.conversationView = new ConversationView({
                    el: this.view.ui.conversation,
                    model: conversation,
                    collection: conversation.get('messages'),
                    childViewOptions: {
                        conversation: conversation
                    }
                });

                this.chatInputController = new ChatInputController({
                    viewOptions: {
                        el: this.view.ui.footer
                    },
                    model: conversation,
                    collection: conversation.get('messages')
                });

                this.listenTo(this.chatInputController, 'message:send', this.sendMessage);

                this.headerView.render();
                this.conversationView.render();
                this.chatInputController.getView().render();
            }.bind(this));
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
        var unreadMessages = this.conversation.get('messages').chain()
            .filter(function(message) {
                // Filter out own messages
                return !_.contains(this.conversation.get('appUsers'), message.get('authorId'));
            }.bind(this))
            .filter(function(message) {
                return Math.floor(message.get('received')) > latestReadTs;
            })
            .value();

        if (this.unread !== unreadMessages.length) {
            this.conversation.set('unread', unreadMessages.length);
        }
    },

    resetUnread: function() {
        var latestReadTs = 0;
        var latestMessage = this.conversation.get('messages').max(function(message) {
            return message.get('received');
        });

        if (latestMessage !== -Infinity) {
            latestReadTs = Math.floor(latestMessage.get('received'));
        }
        this.setLatestReadTime(latestReadTs);
        this.updateUnread();
    }
});