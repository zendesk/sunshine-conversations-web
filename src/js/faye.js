var Faye = require('faye');

var faye = new Faye.Client('http://localhost:8091/faye');

//TODO: Auth
faye.subscribe('/message/*', function(message) {
    console.log('>>>faye message received:', message);
});