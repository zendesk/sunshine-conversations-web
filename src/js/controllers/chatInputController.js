'use strict';

var _ = require('underscore');

var ViewController = require('view-controller');

var ChatInputView = require('../views/chatInputView');

module.exports = ViewController.extend({
    viewClass: ChatInputView,

    viewEvents: {
        'message:send': 'onMessageSend'
    },

    viewTriggers: {
        'message:read': 'message:read'
    },

    onMessageSend: function() {
        var message = this.view.getValue();
        if (!_.isEmpty(message.trim())) {
            this.view.resetValue();
            this.trigger('message:send', message);
        }
    },

    focus: function() {
        this.view.focus();
    }
});
