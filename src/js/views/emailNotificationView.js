'use strict';

var Marionette = require('backbone.marionette');
var _ = require('underscore');

var EmailNotificationTemplate = require('../../templates/emailNotification.tpl');

module.exports = Marionette.ItemView.extend({
    tagName: 'p',
    template: EmailNotificationTemplate,

    ui: {
        close: '[data-ui-close]',
        settingsLink: '[data-ui-settings-link]',
    },

    triggers: {
        'click @ui.close': 'notification:close',
        'click @ui.settingsLink': 'settings:navigate'
    },

    onRender: function() {
        this.$el.hide();

        _.defer(_.bind(this.transitionIn_, this));
    },

    transitionIn_: function() {
        this.$el.slideDown();
    },

    remove: function() {
        var parent_remove = _.bind(function() {
            Marionette.ItemView.prototype.remove.call(this);
        }, this);

        // Calls parent's `view` method after animation completes
        this.$el.slideUp(400, parent_remove);
    },

    serializeData: function() {
        return _.extend(Marionette.ItemView.prototype.serializeData.call(this), {
            settingsNotificationText: this.getOption('settingsNotificationText')
        });
    }
});
