var sinon = require('sinon');

var ClientScenario = require('../scenarios/clientScenario');

describe('Main', function() {
    var scenario,
        sandbox,
        SupportKit;

    before(function() {
        scenario = new ClientScenario();
        scenario.build();
    });

    after(function() {
        scenario.clean();
    });

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        SupportKit = require('../../src/js/main.js');
    });

    afterEach(function() {
        delete global.SupportKit;
        sandbox.restore();
    });

    describe('Global bindings', function() {
        // those tests are using the expect form since undefined
        // cannot be tested with the should syntax
        it('should publish a global', function() {
            expect(global.SupportKit).to.exist;
        });

        it('should not publish dependencies in global context', function() {
            expect(global.Backbone).to.not.exist;
            expect(global._).to.not.exist;
        });
    });

    describe('#init', function() {
        it('should trigger ready', function(done) {
            SupportKit.once('ready', function() {
                done();
            });

            SupportKit.init({
                appToken: 'thisisanapptoken'
            });
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

    describe('#track', function(){

        describe('tracking a new event', function(){
            it('should call /api/event', function(done){

            })
        });
    });
});
