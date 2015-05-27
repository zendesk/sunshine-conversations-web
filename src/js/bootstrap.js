'use strict';

var Backbone = require('backbone'),
    $ = require('jquery');
Backbone.$ = $;
var Marionette = require('backbone.marionette');

require('backbone-associations');

var StickitBehavior = require('marionette.behaviors/lib/behaviors/stickit-behavior');
var jQueryBehavior = require('marionette.behaviors/lib/behaviors/jquery-behavior');


Marionette.Behaviors.behaviorsLookup = function () {
  return {
    stickit: StickitBehavior,
    jQuery: jQueryBehavior
  };
};
