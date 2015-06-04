'use strict';

var _ = require('underscore'),
    Backbone = require('backbone'),
    sinon = require('sinon');

var helpers = require('../helpers');



var BaseMock = module.exports = function(options) {
    options || (options = {});
    this.options = options;

    this._sandbox = sinon.sandbox.create({
        useFakeServer: true
    });

    _.isFunction(this.initialize) && this.initialize.apply(this, arguments);
};

_.extend(BaseMock.prototype, {
    restore: function() {
        this._sandbox.restore();
    },

    mock: function() {
        var target = helpers.getOption(this, 'target'),
            methods = helpers.getOption(this, 'methods');

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

BaseMock.extend = helpers.extend;
