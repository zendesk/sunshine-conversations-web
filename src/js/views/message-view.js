var _ = require('underscore'),
    Backbone = require('backbone');

var template = require('../../templates/messageView.tpl');

var messageView = Backbone.View.extend({
    className: "sk-row",

    initialize: function(options) {
        this.conversation = options.conversation;
    },

    render: function() {
        var isAppMaker = _.contains(this.conversation.get('appMakers'), this.model.get('authorId'));

        this.$el.html(template({
            message: this.model.get("text"),
            from: isAppMaker ? this.model.get("name") : ""
        }));

        this.$el.addClass(isAppMaker ? "sk-left-row" : "sk-right-row");
        return this;
    }
});

module.exports = messageView;