'use strict';

var sinon = require('sinon');
var Backbone = require('backbone');
var urljoin = require('urljoin');

var ClientScenario = require('../scenarios/clientScenario');
var userData = require('../data/user');
var endpoint = require('../../src/js/endpoint');
var api = require('../../src/js/utils/api');
var storage = require('../../src/js/utils/localStorage');

var SK_STORAGE = 'sk_deviceid';

describe('Main', function() {
    var scenario;
    var sandbox;
    var Smooch;

    before(function() {
        scenario = new ClientScenario();
        scenario.build();
    });

    after(function() {
        scenario.clean();
    });

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        Smooch = require('../../src/js/main.js');

        return Smooch.init({
            appToken: 'thisisanapptoken'
        }).then(function() {
            sandbox.stub(Smooch.user, 'save', function(attributes, options) {
                return this._save(attributes, options);
            });
        });

    });

    afterEach(function() {
        Smooch.destroy();
        delete global.Smooch;
        sandbox.restore();
    });

    describe('Global bindings', function() {
        // those tests are using the expect form since undefined
        // cannot be tested with the should syntax
        it('should publish a global', function() {
            global.Smooch.should.exist;
        });

        it('should not publish dependencies in global context', function() {
            expect(global.Backbone).to.not.exist;
            expect(global.jQuery).to.not.exist;
            expect(global._).to.not.exist;
        });
    });

    describe('#init', function() {
        var userId = 'thisisauserid';
        var appToken = 'thisisanapptoken';
        var jwt = 'thisisajwt';
        var apiSpy;
        var initSpy;
        var readySpy;
        var loginSpy;

        beforeEach(function() {
            apiSpy = sandbox.spy(api, 'call');
            initSpy = sandbox.spy();
            readySpy = sandbox.spy();
            loginSpy = sandbox.spy(Smooch, 'login');
        });

        it('should trigger ready, track appboot, login the user and resolve the promise', function() {
            Smooch.destroy();
            Smooch.appbootedOnce = false;

            Smooch.once('ready', readySpy);

            var initPromise = Smooch.init({
                appToken: appToken
            });

            return initPromise.then(initSpy).then(function() {
                loginSpy.should.have.been.calledOnce;
                initSpy.should.have.been.calledOnce;
            });
        });

        it('it should store the deviceId in local storage', function() {
            Smooch.destroy();

            return Smooch.init({
                appToken: appToken,
                userId: userId
            }).then(function() {
                storage.getItem(SK_STORAGE).should.exist;
            });
        });

        it('should populate endpoint with supplied appToken and jwt', function() {
            Smooch.destroy();

            return Smooch.init({
                appToken: appToken,
                jwt: jwt
            }).then(function() {
                endpoint.jwt.should.eql(jwt);
                endpoint.appToken.should.eql(appToken);
            });
        });

        it('should not populate endpoint jwt if unspecified', function() {
            Smooch.destroy();

            return Smooch.init({
                appToken: appToken
            }).then(function() {
                expect(endpoint.jwt).to.not.exist;
            });
        });

        it('should post platform device info to init', function() {
            Smooch.destroy();

            return Smooch.init({
                appToken: appToken
            }).then(function() {
                apiSpy.args[0][0].url.should.eql('v1/init');
                apiSpy.args[0][0].method.should.eql('POST');
                apiSpy.args[0][0].data.device.platform.should.eq('web');
            });
        });
    });

    describe('#login', function() {
        var cleanSpy;

        beforeEach(function() {
            cleanSpy = sandbox.spy(Smooch, '_cleanState');
        });

        it('should cleanState', function() {
            return Smooch.login('some_user_id').then(function() {
                cleanSpy.should.have.been.calledOnce;
            });
        });

        it('should receive a user even if no user id provided', function() {
            Smooch._cleanState();

            return Smooch.login().then(function() {
                endpoint.appUserId.should.equal(userData.appUser._id);
            });

        });

        it('should change the user id and jwt', function() {
            var oldUserId = endpoint.userId;
            var oldJwt = endpoint.jwt;

            var newUserId = 'new_user_id';
            var newJwt = 'new_jwt';

            return Smooch.login(newUserId, newJwt).then(function() {
                newUserId.should.not.equal(oldUserId);
                newJwt.should.not.equal(oldJwt);

                endpoint.userId.should.equal(newUserId);
                endpoint.jwt.should.equal(newJwt);
            });

        });
    });

    describe('#logout', function() {
        var loginStub;
        beforeEach(function() {
            loginStub = sandbox.stub(Smooch, 'login').returns(Promise.resolve());
        });

        it('should call login with no user id if ready', function() {
            Smooch.true = false;
            Smooch.logout().then(function() {
                loginStub.should.have.been.calledWithExactly();
            });
        });

        it('should do nothing if not ready', function() {
            Smooch.ready = false;
            Smooch.logout().then(function() {
                loginStub.should.not.have.been.called();
            });
        });
    });

    describe('#destroy', function() {
        beforeEach(function() {
            storage.setItem(SK_STORAGE, 'test');
            Smooch.destroy();
        });

        afterEach(function() {
            storage.setItem(SK_STORAGE, undefined);
        });

        it('should not remove the device id from local storage', function() {
            expect(storage.getItem(SK_STORAGE)).to.exist;

        });

        it('should clear the endpoint of all variables', function() {
            expect(endpoint.appToken).to.not.exist;
            expect(endpoint.jwt).to.not.exist;
            expect(endpoint.appUserId).to.not.exist;
        });
    });

    describe('#updateUser', function() {

        // check if `save` actually calls the server or not
        var syncSpy;
        beforeEach(function() {
            syncSpy = sandbox.spy(Backbone, 'sync');
        });

        it('should fail the promise if called with bad parameters (empty, in this case)', function() {
            var failed;
            return Smooch.updateUser()
                .catch(function() {
                    failed = true;
                })
                .then(function() {
                    failed.should.be.true;
                });
        });

        it('should not call save if the user has not changed', function() {
            return Smooch.updateUser({
                givenName: 'GIVEN_NAME',
                surname: 'SURNAME',
                properties: {
                    'TEST': true
                }
            }).then(function() {
                syncSpy.should.be.calledOnce;

                return Smooch.updateUser({
                    givenName: 'GIVEN_NAME',
                    surname: 'SURNAME',
                    properties: {
                        'TEST': true
                    }
                });
            }).then(function() {
                syncSpy.should.be.calledOnce;
            });
        });
    });

    describe('#_cleanState', function() {

        beforeEach(function() {
            storage.setItem(SK_STORAGE, 'test');
        });

        afterEach(function() {
            storage.setItem(SK_STORAGE, undefined);
        });

        it('should not remove the device id from local storage', function() {
            expect(storage.getItem(SK_STORAGE)).to.exist;
        });

        it('should clear endpoint values but keep the app token', function() {
            Smooch._cleanState();

            expect(endpoint.appToken).to.exist;
            expect(endpoint.jwt).to.not.exist;
            expect(endpoint.appUserId).to.not.exist;
        });
    });

    describe('#track', function() {
        var api = require('../../src/js/utils/api');
        var apiSpy;

        beforeEach(function() {
            apiSpy = sandbox.spy(api, 'call');
        });

        it('should call /v1/appusers/:id/event', function() {
            Smooch.track('new-event');

            apiSpy.args[0][0].url.should.eq(urljoin(Smooch.user.url(), 'events'));
            apiSpy.args[0][0].method.should.eq('POST');
            apiSpy.args[0][0].data.name.should.eq('new-event');
        });
    });
});
