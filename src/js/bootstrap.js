'use strict';

/**
 * Browser compatibility
 */
require('es5-shim');
require('browsernizr/test/css/transforms');
require('browsernizr');

// Enable CORS for IE8
window.$.support.cors = true;

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
var Backbone = require('backbone'),
    $ = require('jquery');
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
