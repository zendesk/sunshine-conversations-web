var template = require('../../templates/conversation.tpl');
var $ = require('jquery');
var Marionette = require('backbone.marionette');
var MessageView = require('./messageView');

var isKeyboard = false;
var isLandscape = false;
var initialScreenSize;

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

    initialize: function() {
        // http://stackoverflow.com/questions/11600040/jquery-js-html5-change-page-content-when-keyboard-is-visible-on-mobile-devices

        initialScreenSize = window.innerHeight;

        /* Android */
        window.addEventListener('resize', function() {
            isKeyboard = (window.innerHeight < initialScreenSize);
            isLandscape = (screen.height < screen.width);

            this.keyboardToggled();
        }.bind(this), false);

        /* iOS */
        $('input').bind('focus blur', function() {
            $(window).scrollTop(10);
            isKeyboard = $(window).scrollTop() > 0;
            $(window).scrollTop(0);

            this.keyboardToggled();
        });
    },

    scrollToBottom: function(forceBottom) {
        forceBottom ? this.$el.scrollTop(this.$el.get(0).scrollHeight) :
            this.$el.scrollTop(this.$el.get(0).scrollHeight - this.$el.outerHeight() - this.ui.logo.outerHeight());
    },

    onAddChild: function() {
        this.scrollToBottom();
        this.positionLogo();
    },

    onShow: function() {
        this.scrollToBottom();
    },

    serializeData: function() {
        return {
            introText: this.getOption('introText')
        };
    },

    keyboardToggled: function() {
        if (isKeyboard) {
            this.ui.logo.hide();
            this.scrollToBottom(true);
        } else {
            this.ui.logo.show();
            this.scrollToBottom();
        }
    },

    positionLogo: function() {
        var conversationHeight = this.$el.outerHeight();
        var logoHeight = this.ui.logo.outerHeight();
        var introHeight = this.ui.intro.outerHeight();
        var messagesHeight = this.ui.messages.outerHeight();
        var heightRemaining = conversationHeight - (introHeight + messagesHeight + logoHeight);

        if (heightRemaining > logoHeight) {
            this.ui.logo.addClass('anchor-bottom');
        } else {
            this.ui.logo.removeClass('anchor-bottom');
        }
    }
});
