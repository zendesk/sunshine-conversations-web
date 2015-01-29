var Backbone = require('backbone');

var template = require('../templates/chatInputView.tpl');
var MessageView = require('./messageView');

var chatInputView = Backbone.View.extend({
    events: {
        'submit form': 'submit',
        'click .send': 'submit'
    },
    render: function() {
        this.$el.html(template());
        return this;
    },
    submit: function() {
        var text = this.$el.find("input").val().trim();
        if (text.length > 0) {
            window.SupportKit.message(text);
        }
    }
});

module.exports = chatInputView;