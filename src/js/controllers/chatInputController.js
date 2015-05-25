'use strict';

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore');

var ViewController = require('view-controller');

var ChatInputView = require('../views/chatInputView'),
    vent = require('../vent');

module.exports = ViewController.extend({
    viewClass: ChatInputView,

    viewEvents: {
        'message:send': 'onMessageSend',
        'message:read': 'onMessageRead'
    },

    onMessageSend: function() {
        var message = this.view.getValue();
        if (!_.isEmpty(message.trim())) {
            this.view.resetValue();
            this.trigger('message:send', message);
        }
    },

    onMessageRead: function() {
        this.model.resetUnread();
    }
});