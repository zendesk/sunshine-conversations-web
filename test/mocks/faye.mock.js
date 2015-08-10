'use strict';

var BaseMock = require('./baseMock');
var faye = require('faye');
var sinon = require('sinon');

var $ = require('jquery');

require('sinon-as-promised');

module.exports = BaseMock.extend({
    target: faye.Client.prototype,
    methods: {
        addExtension: sinon.stub(),
        connect: sinon.stub(),
        subscribe: function() {
            return $.Deferred().resolve({
                disconnect: function(){}
            });
        }
    }
});
