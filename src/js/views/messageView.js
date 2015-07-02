var Marionette = require('backbone.marionette'),
    urljoin = require('urljoin');

var template = require('../../templates/message.tpl'),
    endpoint = require('../endpoint');

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
                observe: ['avatarUrl', 'authorId'],
                update: function($el, values) {
                    var url = values[0],
                        id = values[1];
                    if (this._isAppMaker()) {
                        url = url || urljoin(endpoint.rootUrl, '/api/users/', id, '/avatar');
                        $el.attr('src', url);
                    }
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

        return !!appMakers.findWhere({
            id: this.model.get('authorId')
        });
    }
});
