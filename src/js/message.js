var _ = require('underscore');
var Backbone = require('backbone');
var baseMethods = require('./baseMethods');

var Message = Backbone.Model.extend({});

_.extend(Message.prototype, baseMethods);
module.exports = Message;