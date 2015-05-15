'use strict';

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore');

var ViewController = require('view-controller');

var endpoint = require('../endpoint'),
    faye = require('../faye');

var ChatView = require('../views/chat-view'),
    HeaderView = require('../views/header-view'),
    ConversationView = require('../views/conversation-view');

var ChatInputController = require('../controllers/chat-input-controller');

module.exports = ViewController.extend({
    viewClass: ChatView,

    viewEvents: {
        render: 'onRender',
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

    resetUnread: function() {
        this.model.resetUnread();
    },

    sendMessage: function(text) {
        if (!!this.conversation) {
            var message = this.conversation.get('messages').create({
                authorId: endpoint.appUserId,
                text: text
            });

            this.conversationView.scrollToBottom();

            return message;
        }
    },

    onRender: function() {
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
            })
            .then(function(conversation) {
                this.model = conversation;

                this.headerView = new HeaderView({
                    el: this.view.ui.header,
                    model: conversation
                });

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
    }
});