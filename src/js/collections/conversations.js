var BaseCollection = require('./baseCollection');
var Conversation = require('../models/conversation');

module.exports = BaseCollection.extend({
    model: Conversation,
    url: 'conversations/'
});
