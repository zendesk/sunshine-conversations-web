'use strict';
require('es6-promise').polyfill();

// polyfill for window.fetch
require('whatwg-fetch');
require('./utils/backbone.ajax');
var $ = require('jquery');

require('./utils/jquery.support.cssproperty');

// Polyfill Object.getPrototypeOf
// http://ejohn.org/blog/objectgetprototypeof/
if (typeof Object.getPrototypeOf !== 'function') {
    if (typeof 'test'.__proto__ === 'object') {
        Object.getPrototypeOf = function(object) {
            return object.__proto__;
        };
    } else {
        Object.getPrototypeOf = function(object) {
            // May break if the constructor has been tampered with
            return object.constructor.prototype;
        };
    }
}

/**
 * Marionette setup
 */
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');

require('backbone-associations');

var StickitBehavior = require('marionette.behaviors/lib/behaviors/stickit-behavior');
var jQueryBehavior = require('marionette.behaviors/lib/behaviors/jquery-behavior');


Marionette.Behaviors.behaviorsLookup = function() {
    return {
        stickit: StickitBehavior,
        jQuery: jQueryBehavior
    };
};
