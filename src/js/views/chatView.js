var Marionette = require('backbone.marionette'),
    _ = require('underscore');

var template = require('../../templates/chat.tpl');

var HeaderView = require('./headerView'),
    ConversationView = require('./conversationView'),
    ChatInputView = require('./chatInputView');

module.exports = Marionette.LayoutView.extend({
    id: 'sk-container',

    template: template,

    className: 'sk-noanimation sk-close',

    triggers: {
        'focus @ui.wrapper': 'focus'
    },

    modelEvents: {
        'change': 'open'
    },

    ui: {
        wrapper: '#sk-wrapper'
    },

    regions: {
        header: '[data-region-header]',
        main: '[data-region-main]',
        footer: '[data-region-footer]'
    },

    open: function() {
        this.enableAnimation();
        this.$el.removeClass('sk-close').addClass('sk-appear');
    },

    close: function() {
        this.enableAnimation();
        this.$el.removeClass('sk-appear').addClass('sk-close');
        this.model.resetUnread();
    },

    toggle: function() {
        this.enableAnimation();
        this.$el.toggleClass('sk-appear sk-close');
    },

    enableAnimation: function() {
        this.$el.removeClass('sk-noanimation');
    }
});
