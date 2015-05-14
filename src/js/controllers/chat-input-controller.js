'use strict';

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore');

var ViewController = require('view-controller');

var ChatInputView = require('../views/chat-input-view');

module.exports = ViewController.extend({
    viewClass: ChatInputView,

    viewEvents: {
        'message:send': 'onMessageSend',
        'message:read': 'onMessageRead'
    },

    onMessageSend: function() {
        this.view.getValue();
        this.view.resetValue();
    },

    onMessageRead: function() {
        this.model.resetUnread();
    }
});