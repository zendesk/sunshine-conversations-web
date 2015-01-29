var ChatBox = Backbone.View.extend({
    render: function() {
        this.$el.html(template({
            me: "jp"
        }));
        return this;
    }
});

module.exports = ChatBox;