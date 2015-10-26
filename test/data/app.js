var user = require('./user');
var _ = require('underscore');

module.exports = {
    'settings': {
        'track': true,
        'pushEnabled': false
    },
    'appUserId': 1,
    'appUser': _.extend({}, user.appUser),
    'conversationStarted': true,
    'rules': [
        {
            '_id': '558c455fa2dad5d0581f0a0b',
            'events': ['in-rule-in-event', 'in-rule-not-event']
        }
    ],
    'hasIcon': false,
    'events': ['in-rule-in-event', 'not-rule-in-event']
};
