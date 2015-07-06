var Marionette = require('backbone.marionette'),
    _ = require('underscore');

var template = require('../../templates/settings.tpl');

module.exports = Marionette.ItemView.extend({
    id: 'sk-settings',
    template: template,

    onRender: function() {
        this.$el.hide();

        _.defer(_.bind(this.transitionIn, this));
    },

    transitionIn: function() {
        this.$el.animate({
            width: 'toggle'
        }, 250);
    },

    transitionOut: function(cb) {
        this.$el.animate({
            width: 'toggle'
        }, 150, cb);
    },

    remove: function() {
        var parentRemove = _.bind(function() {
            Marionette.ItemView.prototype.remove.call(this);
        }, this);

        // Calls parent's `view` method after animation completes
        this.transitionOut(parentRemove);
    }
});
