'use strict';

var BaseMock = require('./baseMock');
var faye = require('../../src/js/faye');
var sinon = require('sinon');

require('sinon-as-promised');

module.exports = BaseMock.extend({
    target: faye,
    methods: {
        init: function() {
            return Promise.resolve({
                subscription: {
                    cancel: function() {}
                }
            });
        }
    }
});
