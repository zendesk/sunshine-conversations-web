var Marionette = require('backbone.marionette');
var template = require('../../templates/chatInput.tpl');

module.exports = Marionette.ItemView.extend({
    id: 'sk-footer',

    template: template,

    events: {
        'submit form': 'submit',
        'click .send': 'submit',
        'keyup input': 'resetUnread'
    },

    triggers: {
        'submit @ui.form': 'message:send',
        'click @ui.sendButton': 'message:send',
        'keyup @ui.input': 'message:read'
    },

    ui: {
        input: '[data-ui-input]',
        form: '[data-ui-form]',
        sendButton: '[data-ui-send]'
    },

    getValue: function() {
        return this.ui.input.val();
    },

    resetValue: function() {
        this.ui.input.val('');
    },

    focus: function() {
        this.ui.input.focus();
    },

    serializeData: function() {
        return {
            inputPlaceholder: this.getOption('inputPlaceholder'),
            sendButtonText: this.getOption('sendButtonText')
        };
    }
});
