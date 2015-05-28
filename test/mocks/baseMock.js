'use strict';

var _ = require('underscore'),
    Backbone = require('backbone'),
    sinon = require('sinon');



var BaseMock = module.exports = function(options) {
    options || (options = {});
    this.options = options;

    _.isFunction(this.initialize) && this.initialize.apply(this, arguments);
    this._sandbox = sinon.sandbox.create();
};

_.extend(BaseMock.prototype, {
    restore: function() {
        this._sandbox.restore();
    },

    mock: function() {
        var target = this.options.target,
            methods = this.options.methods;

        if (!target || !methods) {
            throw new Error('Must provide a target and methods to mock');
        }

        var mockedObject = {};

        _(methods).chain().keys().each(function(methodName) {
            var method = methods[methodName];
            mockedObject[methodName] = this._sandbox.stub(target, methodName, method);
        }.bind(this));
    }
});

BaseMock.extend = Backbone.Model.extend;
