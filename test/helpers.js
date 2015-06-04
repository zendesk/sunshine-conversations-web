'use strict';

var _ = require('underscore');

module.exports = {
    // Extend function borrowed directly from Backbone source.
    extend: function(protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply(this, arguments);
            };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent` constructor function.
        var Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) {
            _.extend(child.prototype, protoProps);
        }

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    },

    // getOption function borrowed directly from Marionette source.
    getOption: function(target, optionName) {
        if (!target || !optionName) {
            return;
        }
        if (target.options && (target.options[optionName] !== undefined)) {
            return target.options[optionName];
        } else {
            return target[optionName];
        }
    }
};
