'use strict';

var BaseMock = require('./baseMock');
var faye = require('faye'),
    sinon = require('sinon');

require('sinon-as-promised');

module.exports = BaseMock.extend({
    target: faye.Client.prototype,
    methods: {
        addExtension: sinon.stub(),
        connect: sinon.stub(),
        subscribe: sinon.stub().resolves()
    }
});
