'use strict';

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore');

var ViewController = require('view-controller');

var ChatView = require('../views/chat-view'),
    HeaderView = require('../views/header-view'),
    ConversationView = require('../views/conversation-view'),
    ChatInputView = require('../views/chat-input-view');

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
        this.header = new HeaderView({
            el: this.view.ui.header,
            model: this.model
        });
        this.conversation = new ConversationView({
            el: this.view.ui.conversation,
            model: this.model
        });

        this.chatInput = new ChatInputView({
            el: this.view.ui.footer,
            model: this.model
        });

        this.header.render();
        this.conversation.render();
        this.chatInput.render();
    }
});