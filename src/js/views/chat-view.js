var Marionette = require('backbone.marionette'),
    _ = require("underscore");

var template = require('../../templates/chatView.tpl');

var HeaderView = require('./header-view'),
    ConversationView = require('./conversation-view'),
    ChatInputView = require('./chat-input-view');

var ChatView = Marionette.LayoutView.extend({
    id: 'sk-container',

    template: template,

    className: 'sk-noanimation sk-close',

    triggers: {
        "focus @ui.wrapper": "focus"
    },

    modelEvents: {
        'change': 'open'
    },

    ui: {
        header: '#sk-header',
        conversation: '#sk-conversation',
        footer: '#sk-footer',
        wrapper: '#sk-wrapper'
    },

    open: function() {
        this.enableAnimation();
        this.$el.removeClass("sk-close").addClass("sk-appear");
    },

    close: function() {
        this.enableAnimation();
        this.$el.removeClass("sk-appear").addClass("sk-close");
        this.model.resetUnread();
    },

    toggle: function() {
        this.enableAnimation();
        this.$el.toggleClass("sk-appear sk-close");
    },

    enableAnimation: function() {
        this.$el.removeClass("sk-noanimation");
    }
});

module.exports = ChatView;