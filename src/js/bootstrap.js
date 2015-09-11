'use strict';
require("babelify/polyfill");

// polyfill for window.fetch
require('whatwg-fetch');
require('./utils/backbone.ajax');
var $ = require('jquery');

require('./utils/jquery.support.cssproperty');

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
