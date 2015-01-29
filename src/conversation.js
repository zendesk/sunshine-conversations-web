var _ = require('underscore');
var Backbone = require('backbone');
var sync = Backbone.sync;
var baseMethods = require('./baseMethods');

var Conversation = Backbone.Model.extend({});

_.extend(Conversation.prototype, baseMethods);
module.exports = Conversation;