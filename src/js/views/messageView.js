var _ = require('underscore'),
    Marionette = require('backbone.marionette');

var template = require('../../templates/message.tpl');

module.exports = Marionette.ItemView.extend({
    template: template,
    className: function() {
        return 'sk-row ' + (this._isAppMaker() ? 'sk-left-row' : 'sk-right-row');
    },

    ui: {
        name: '[data-ui-name]',
        message: '[data-ui-message]',
        avatar: '[data-ui-avatar]'
    },

    behaviors: {
        stickit: {
            '@ui.name': {
                observe: 'name',
                onGet: function(value) {
                    return this._isAppMaker() ? value : '';
                }
            },
            '@ui.message': 'text',
            '@ui.avatar': {
                observe: 'avatarUrl',
                update: function($el, val, model) {
                    $el.attr('src', val);
                },
                visible: function() {
                    return this._isAppMaker();
                },
                updateView: true
            }
        }
    },

    _isAppMaker: function() {
        var appMakers = this.getOption('conversation').get('appMakers');
        return !!appMakers.get(this.model.get('authorId'));
    }
});
