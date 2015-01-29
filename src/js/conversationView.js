var Backbone = require('backbone');

var template = require('../templates/conversationView.tpl');

var conversationView = Backbone.View.extend({
    render: function() {
        this.$el.html(template());
        return this;
    }
});

module.exports = conversationView;