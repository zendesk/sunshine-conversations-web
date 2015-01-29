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
        console.log(this.$el.find("input").val());
    }
});

module.exports = chatInputView;