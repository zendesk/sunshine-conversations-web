var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore');

var template = require('../../templates/conversation.tpl');

var MessageView = require('./messageView'),
    Message = require('../models/message');

module.exports = Marionette.CompositeView.extend({
    id: 'sk-conversation',

    childView: MessageView,
    template: template,

    childViewContainer: '[data-ui-messages]',

    introText: 'This is the beginning of your conversation.<br/> Ask us anything!',

    scrollToBottom: function() {
        this.$el.scrollTop(this.$el.get(0).scrollHeight);
    },

    onAddChild: function() {
        this.scrollToBottom();
    },

    onShow: function() {
        this.scrollToBottom();
    },

    serializeData: function() {
        return {
            introText: this.getOption('introText')
        };
    }
});
