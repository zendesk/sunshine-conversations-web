var BaseCollection = require('./base-collection');
var Message = require('../models/message');
var endpoint = require('../endpoint');

module.exports = BaseCollection.extend({
    model: Message
});
