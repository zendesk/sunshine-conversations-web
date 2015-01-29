var Backbone = require('backbone');

var template = require('../templates/messageView.tpl');

var messageView = Backbone.View.extend({
    className: "sk-row",
    render: function() {
        var isKevin = !!(Math.floor(Math.random() * 2) === 0);
        this.$el.html(template({
            message: "a message",
            from: isKevin ? "Kevin" : ""
        }));

        this.$el.addClass(isKevin ? "sk-left-row" : "sk-right-row");
        return this;
    }
});

module.exports = messageView;