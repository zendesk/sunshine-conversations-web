'use strict';

var Marionette = require('backbone.marionette');
var _ = require('underscore');

var template = require('../../templates/settingsHeader.tpl');

module.exports = Marionette.ItemView.extend({
    id: 'sk-settings-header',

    ui: {
        closeButton: '[data-ui-close]'
    },

    triggers: {
        'click': 'settings:close',
        'click @ui.closeButton': 'widget:close'
    },

    template: template,

    serializeData: function() {
        return _.extend(Marionette.ItemView.prototype.serializeData.call(this), {
            settingsHeaderText: this.getOption('settingsHeaderText')
        });
    }
});
