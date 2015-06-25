var users = require('./users');

var user = users[1];

module.exports = {
    'settings': {
        'track': true,
        'pushEnabled': false
    },
    'appUserId': 1,
    'appUser': user,
    'conversationStarted': true,
    'rules': [
        {
            '_id': '558c455fa2dad5d0581f0a0b',
            'events': ['in-rule']
        }
    ],
    'hasIcon': false,
    'events': ['in-rule', 'not-in-rule']
};
