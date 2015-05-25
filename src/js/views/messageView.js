var _ = require('underscore'),
    Marionette = require('backbone.marionette');

var template = require('../../templates/message.tpl');

module.exports = Marionette.ItemView.extend({
    template: template,
    className: function() {
        return 'sk-row ' + (this._isAppMaker() ? 'sk-left-row' : 'sk-right-row');
    },

    serializeData: function() {
        var data = Marionette.ItemView.prototype.serializeData.call(this);
        return _(data).extend({
            name: this._isAppMaker() ? data.name : ''
        });
    },

    _isAppMaker: function() {
        var appMakers = this.getOption('conversation').get('appMakers');
        return _.contains(appMakers, this.model.get('authorId'));
    }
});
