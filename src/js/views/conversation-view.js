var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore');

var template = require('../../templates/conversation.tpl');

var MessageView = require('./message-view'),
    Message = require('../models/message');

module.exports = Marionette.CompositeView.extend({
    childView: MessageView,
    template: template,

    childViewContainer: '[data-ui-messages]',

    collectionEvents: {
        'add': 'scrollToBottom'
    },

    scrollToBottom: function() {
        this.$el.scrollTop(this.$el.get(0).scrollHeight);
    },

    onRenderCollection: function() {
        this.scrollToBottom();

        // subsequents add will scroll
        this.listenTo(this, 'add:child', this.scrollToBottom);
    }
});