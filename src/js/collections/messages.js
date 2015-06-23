var BaseCollection = require('./baseCollection');
var Message = require('../models/message');

module.exports = BaseCollection.extend({
    model: Message,
    comparator: 'received'
});
