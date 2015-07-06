'use strict';

var Marionette = require('backbone.marionette');

var template = require('../../templates/settingsHeader.tpl');

module.exports = Marionette.ItemView.extend({
    id: 'sk-settings-header',

    triggers: {
        'click @ui.closeButton': 'settings:close'
    },

    template: template,

    ui: {
        closeButton: '[data-ui-close]'
    }
});
