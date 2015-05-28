'use strict';


var _ = require('underscore');

var ScenarioBuilder = function() {};

var ScenarioBuilder = module.exports = function(options) {
    options || (options = {});
    this.options = options;
    _.isFunction(this.initialize) && this.initialize.apply(this, arguments);
};

_.extend(ScenarioBuilder.prototype, {
    mocks: [],

    build: function() {
        _(this.mocks).each(function(mock) {
           mock.mock();
        });
    },

    clean: function() {
        _(this.mocks).each(function(mock) {
            mock.restore();
        });
    }

});


ScenarioBuilder.extend = function(childOpts) {
    var Parent = this;

    var Child = function() {};
    _.extend(Child.prototype, Parent.prototype, childOpts || {});

    Child.extend = ScenarioBuilder.extend;

    Child.prototype.__super__ = Parent.prototype;
    return Child;
};
