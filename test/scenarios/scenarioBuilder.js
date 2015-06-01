'use strict';


var _ = require('underscore'),
    helpers = require('../helpers');

var ScenarioBuilder = function() {};

var ScenarioBuilder = module.exports = function(options) {
    options || (options = {});
    this.options = options;
    this._mocks = {};
    _.isFunction(this.initialize) && this.initialize.apply(this, arguments);
};

_.extend(ScenarioBuilder.prototype, {
    mocks: [],

    build: function() {
        _(this.mocks).each(function(Mock, name) {
            var mock = this._mocks[name] = new Mock();
            mock.mock();
        }.bind(this));
    },

    clean: function() {
        _(this._mocks).chain().values().each(function(mock) {
            mock.restore();
        });

        this._mocks = {};
    }

});


ScenarioBuilder.extend = helpers.extend;