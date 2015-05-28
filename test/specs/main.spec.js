var sinon = require('sinon');

var ClientScenario = require('../scenarios/clientScenario');
describe('Main', function() {
    var scenario;

    before(function() {
        scenario = new ClientScenario();
        scenario.build();
    });

    after(function() {
        scenario.clean();
    });


    describe('Global bindings', function() {
        var SupportKit = require('../../src/js/main.js');


        it('should publish a global', function() {
            window.SupportKit.should.not.be.undefined;

        });
    });

});
