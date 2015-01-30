var Backbone = require('backbone');

var template = require('../templates/headerView.tpl');

var headerView = Backbone.View.extend({
    events: {
        "click #sk-handle": "toggle"
    },
    render: function() {
        this.$el.html(template({
            count: 2000
        }));
        return this;
    },
    toggle: function() {
        $("#sk-container").removeClass("sk-noanimation").toggleClass("sk-appear sk-close");
    }
});

module.exports = headerView;