'use strict';

var Marionette = require('backbone.marionette');

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

    template: template
});
