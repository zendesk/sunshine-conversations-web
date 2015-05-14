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

    onRender: function() {
        this.collection.fetch()
            .then(function() {
                return this.collection
                    ? this.collection.at(0)
                    : this.collection.create({
                        appUserId: endpoint.appUserId
                    }, {
                        wait: true
                    });
            }.bind(this))
            .then(function(conversation) {
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
                    collection: conversation.get('messages')
                });

                this.chatInputController = new ChatInputController({
                    viewOptions: {
                        el: this.view.ui.footer
                    },
                    model: conversation
                });

                this.headerView.render();
                this.conversationView.render();
                this.chatInputController.getView().render();
            }.bind(this));
    }
});