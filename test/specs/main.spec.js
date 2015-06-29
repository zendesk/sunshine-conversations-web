var sinon = require('sinon');
var cookie = require('cookie');
var endpoint = require('../../src/js/endpoint');

var ClientScenario = require('../scenarios/clientScenario');
var SK_STORAGE = 'sk_deviceid';

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
            global.SupportKit.should.exist;
        });

        it('should not publish dependencies in global context', function() {
            expect(global.Backbone).to.not.exist;
            expect(global._).to.not.exist;
        });
    });

    describe('#init', function() {
        var userId = 'thisisauserid',
            appToken = 'thisisanapptoken',
            jwt = 'thisisajwt';

        it('should trigger ready', function(done) {
            SupportKit.once('ready', function() {
                done();
            });

            SupportKit.init({
                appToken: appToken
            });
        });

        it('if supplied a userId should store the deviceId in local storgae', function(done) {
            SupportKit.once('ready', function() {
                localStorage.getItem(SK_STORAGE + '_' + userId).should.exist;
                done();
            });

            SupportKit.init({
                appToken: appToken,
                userId: userId
            });
        });

        it('should populate endpoint with supplied appToken and jwt', function(done) {
            SupportKit.once('ready', function() {
                endpoint.jwt.should.eql(jwt);
                endpoint.appToken.should.eql(appToken);
                done();
            });

            SupportKit.init({
                appToken: appToken,
                jwt: jwt
            });
        });
    });

    describe('#logout', function() {
        beforeEach(function() {
            document.cookie = SK_STORAGE + '=' + 'test';
            SupportKit.logout();
        });

        it('should remove the device id from cookies', function() {
            expect(cookie.parse(document.cookie)[SK_STORAGE]).to.not.exist;
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
            SupportKit._updateUser.should.be.calledOnce;
        });

        it('should throw an error if called with bad parameters (empty, in this case)', function() {
            SupportKit.updateUser.should.throw(Error);
        });

        it('should not call update user if the user has not changed', function() {
            SupportKit._updateUser.should.be.calledOnce;

            SupportKit.updateUser({
                givenName: 'GIVEN_NAME',
                surname: 'SURNAME',
                properties: {
                    'TEST': true
                }
            });

            SupportKit._updateUser.should.be.calledOnce;
        });
    });
});
