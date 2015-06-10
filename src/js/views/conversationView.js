var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore'),
    $ = require('jquery');

var template = require('../../templates/conversation.tpl');

var MessageView = require('./messageView'),
    Message = require('../models/message');

module.exports = Marionette.CompositeView.extend({
    id: 'sk-conversation',

    childView: MessageView,
    template: template,

    childViewContainer: '[data-ui-messages]',

    ui: {
        logo: '.sk-logo',
        intro: '.sk-intro',
        messages: '[data-ui-messages]'
    },

    events: {
        'scroll': 'fadeLogo'
    },

    scrollToBottom: function() {
        this.$el.scrollTop(this.$el.get(0).scrollHeight);
    },

    onAddChild: function() {
        this.scrollToBottom();
        this.fadeLogo();
    },

    onShow: function() {
        this.scrollToBottom();
    },

    serializeData: function() {
        return {
            introText: this.getOption('introText')
        };
    },

    fadeLogo: function() {
        var conversationHeight = this.$el.outerHeight(),
            logoHeight = this.ui.logo.outerHeight(),
            heightRemaining = conversationHeight - (this.ui.intro.outerHeight() + this.ui.messages.outerHeight() + this.ui.logo.outerHeight()),
            scrollFromBottom = this.el.scrollHeight - conversationHeight - this.el.scrollTop,
            opacity,
            blur;

        heightRemaining = heightRemaining < 0 ? scrollFromBottom : heightRemaining;

        opacity = heightRemaining / conversationHeight,
        blur = ((1 - opacity) < 0 ? 0 : (1 - opacity)) * 5;

        console.log('blur :: ', blur);

        this.ui.logo.css({
            'opacity': opacity,
            'filter': 'blur(' + blur + 'px)',
            '-webkit-filter': 'blur(' + blur + 'px)',
            '-moz-filter': 'blur(' + blur + 'px)',
            '-o-filter': 'blur(' + blur + 'px)',
            '-ms-filter': 'blur(' + blur + 'px)'
        });
    }
});
