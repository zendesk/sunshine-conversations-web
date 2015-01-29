var Backbone = require('backbone');

var template = require('../templates/conversationView.tpl');
var MessageView = require('./messageView');

var conversationView = Backbone.View.extend({
    render: function() {
        this.$el.html(template());
        this.appendMessage({});
        this.appendMessage({});
        this.appendMessage({});
        this.appendMessage({});
        this.appendMessage({});
        this.appendMessage({});
        this.appendMessage({});

        return this;
    },
    appendMessage: function(message) {
        var view = new MessageView({
            model: message
        });
        view.render();
        this.$el.append(view.el);
    }
});

module.exports = conversationView;