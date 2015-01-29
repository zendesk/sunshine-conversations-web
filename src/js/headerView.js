var Backbone = require('backbone');

var template = require('../templates/headerView.tpl');

var headerView = Backbone.View.extend({
    render: function() {
        this.$el.html(template({
            count: 2000
        }));
        return this;
    }
});

module.exports = headerView;