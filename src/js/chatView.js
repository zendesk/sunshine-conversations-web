var Backbone = require('backbone');

var template = require('../templates/hello.tpl');

var ChatView = Backbone.View.extend({
    render: function() {
        this.$el.html(template({
            me: "chat view3"
        }));
        return this;
    }
});

module.exports = ChatView;