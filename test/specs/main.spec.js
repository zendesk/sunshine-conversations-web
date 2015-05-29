var sinon = require('sinon'),
    _ = require('underscore');

var ClientScenario = require('../scenarios/clientScenario');
describe('Main', function() {
    var scenario,
        SupportKit,
        sandbox;

    before(function() {
        scenario = new ClientScenario();
        scenario.build();

        sandbox = sinon.sandbox.create();

        SupportKit = require('../../src/js/main.js');
    });

    after(function() {
        sandbox.restore();
        scenario.clean();
    });


    describe('Global bindings', function() {
        var SupportKit = require('../../src/js/main.js');


        // those tests are using the expect form since undefined
        // cannot be tested with the should syntax
        it('should publish a global', function() {
            expect(global.SupportKit).to.not.be.undefined;
        });

        it('should not publish dependencies in global context', function() {
            expect(global.Backbone).to.be.undefined;
            expect(global.jQuery).to.be.undefined;
            expect(global._).to.be.undefined;
        })
    });

    describe('#init', function() {
        var readySpy;

        beforeEach(function() {
            readySpy = sandbox.spy();
            SupportKit.on('ready', readySpy);
        });

        afterEach(function() {
            SupportKit.off('ready', readySpy);
            sandbox.restore();
        });

        it('should trigger ready', function(done) {
            // this one should run after the spy one since
            // it was registered after it.
            SupportKit.on('ready', function() {
                readySpy.should.have.been.calledOnce;
                done();
            })

            SupportKit.init({
                appToken: 'thisisanapptoken',
                givenName: 'Testing',
                surname: 'Guy',
                properties: {
                    'isAwesome': true
                }
            });


        });
    });

});
