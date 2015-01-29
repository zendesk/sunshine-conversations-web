var Backbone = require('backbone');

var template = require('../templates/conversationView.tpl');
var MessageView = require('./messageView');

var conversationView = Backbone.View.extend({
    render: function() {
        this.$el.html(template());

        this.scrollToBottom();

        return this;
    },
    appendMessage: function(message) {
        var view = new MessageView({
            model: message
        });
        view.render();
        this.$el.append(view.el);
    },
    scrollToBottom: function() {
        this.$el.animate({
            scrollTop: this.$el.get(0).scrollHeight
        }, 1000);
    }
});

module.exports = conversationView;