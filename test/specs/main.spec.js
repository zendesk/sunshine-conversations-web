var sinon = require('sinon'),
    _ = require('underscore');

var SupportKit = require('../../src/js/main.js');
var ClientScenario = require('../scenarios/clientScenario');

describe('Main', function() {
    var scenario,
        sandbox;

    before(function() {
        scenario = new ClientScenario();
        scenario.build();
    });

    after(function() {
        scenario.clean();
    });

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('Global bindings', function() {
        // those tests are using the expect form since undefined
        // cannot be tested with the should syntax
        it('should publish a global', function() {
            expect(global.SupportKit).to.not.be.undefined;
        });

        it('should not publish dependencies in global context', function() {
            expect(global.Backbone).to.be.undefined;
            expect(global._).to.be.undefined;
        });
    });

    describe('#init', function() {
        var readySpy;

        beforeEach(function(done) {
            readySpy = sandbox.spy();

            SupportKit.once('ready', function() {
                readySpy();
                done();
            });

            SupportKit.init({
                appToken: 'thisisanapptoken',
                givenName: 'Testing',
                surname: 'Guy',
                properties: {
                    'isAwesome': true
                }
            });
        });

        it('should trigger ready', function() {
            readySpy.should.have.been.calledOnce;
        });
    });

    describe('#updateUser', function() {
        beforeEach(function() {
            var AppUser = require('../../src/js/models/appUser');

            sandbox.stub(SupportKit, '_updateUser');
            SupportKit.throttledUpdate = SupportKit._updateUser;

            SupportKit.user = new AppUser({
                givenName: 'test',
                surname: 'user'
            });

            SupportKit.updateUser({
                givenName: 'GIVEN_NAME',
                surname: 'SURNAME',
                properties: {
                    'TEST': true
                }
            });
        });

        it('should call _updateUser', function() {
            expect(SupportKit._updateUser).to.be.calledOnce;
        });

        it('should throw an error if called with bad parameters (empty, in this case)', function() {
            expect(SupportKit.updateUser).to.throw(Error);
        });

        it('should not call update user if the user has not changed', function() {
            expect(SupportKit._updateUser).to.be.calledOnce;

            SupportKit.updateUser({
                givenName: 'GIVEN_NAME',
                surname: 'SURNAME',
                properties: {
                    'TEST': true
                }
            });

            expect(SupportKit._updateUser).to.be.calledOnce;
        });
    });
});
