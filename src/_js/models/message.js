'use strict';

var Backbone = require('backbone-associations');

module.exports = Backbone.AssociatedModel.extend({
    idAttribute: '_id',

    parse: function(data) {
        return data.message || data;
    }
});
