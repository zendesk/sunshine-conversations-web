var sinon = require('sinon');
var _ = require('underscore');
var AppUser = require('../../src/js/models/appUser');

var ClientScenario = require('../scenarios/clientScenario');

describe('AppUser', function() {
    var scenario;
    var sandbox;

    before(function() {
        scenario = new ClientScenario();
        scenario.build();

        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });

    after(function() {
        scenario.clean();
    });

    describe('#parse', function() {
        describe('with object', function() {
            it('should set the object in the attributes', function() {
                var email = 'some@email.com';
                var givenName = 'Some';
                var surname = 'Name';

                var user = new AppUser({
                    appUser: {
                        email: email,
                        givenName: givenName,
                        surname: surname
                    }
                }, {
                    parse: true
                });

                user.get('email').should.equal(email);
                user.get('givenName').should.equal(givenName);
                user.get('surname').should.equal(surname);

            });
        });
    });

    describe('#isDirty', function() {
        it('should mark the user as dirty after init', function() {
            var email = 'some@email.com';
            var givenName = 'Some';
            var surname = 'Name';
            var id = '12345';

            var user = new AppUser({
                email: email,
                givenName: givenName,
                surname: surname,
                id: id
            });

            user.isDirty().should.be.true;
        });

        it('should not be marked as dirty after saving', function(done) {
            var email = 'some@email.com';
            var givenName = 'Some';
            var surname = 'Name';
            var id = '12345';

            var user = new AppUser({
                email: email,
                givenName: givenName,
                surname: surname,
                _id: id
            });

            sandbox.stub(user, 'save', function(attributes, options) {
                return this._save(attributes, options);
            });

            user.isDirty().should.be.true;

            user.save().then(function() {
                user.isDirty().should.be.false;
                done();
            }).catch(done);

        });

        it('should not be marked as dirty if changes are reverted', function(done) {
            var email = 'some@email.com';
            var givenName = 'Some';
            var surname = 'Name';
            var id = '12345';
            var properties = {
                TEST: true
            };

            var user = new AppUser({
                email: email,
                givenName: givenName,
                surname: surname,
                properties: properties,
                _id: id
            });

            sandbox.stub(user, 'save', function(attributes, options) {
                return this._save(attributes, options);
            });

            user.isDirty().should.be.true;

            user.save()
                .then(function() {
                    user.isDirty().should.be.false;

                    user.set({
                        email: 'other@email.com'
                    });

                    user.isDirty().should.be.true;
                })
                .then(function() {
                    user.set({
                        email: email
                    });
                    user.isDirty().should.be.false;
                    done();
                })
                .catch(done);
        });

        it('should be true if different properties are passed', function() {
            var email = 'some@email.com';
            var givenName = 'Some';
            var surname = 'Name';
            var id = '12345';
            var properties = {
                TEST: true
            };

            var user = new AppUser({
                appUser: {
                    email: email,
                    givenName: givenName,
                    surname: surname,
                    properties: properties,
                    _id: id
                }
            });

            // force isDirty to be false at start
            user._lastPropertyValues = user.pick(AppUser.EDITABLE_PROPERTIES);
            user.isDirty().should.be.false;

            user.isDirty({
                email: 'other@email.com',
                properties: _.clone(properties)
            }).should.be.true;

        });

        it('should be false if same properties are passed', function() {
            var email = 'some@email.com';
            var givenName = 'Some';
            var surname = 'Name';
            var id = '12345';
            var properties = {
                TEST: true
            };

            var user = new AppUser({
                email: email,
                givenName: givenName,
                surname: surname,
                properties: properties,
                _id: id
            });

            // force isDirty to be false at start
            user._lastPropertyValues = user.pick(AppUser.EDITABLE_PROPERTIES);
            user.isDirty().should.be.false;

            user.isDirty({
                email: email,
                properties: _.clone(properties)
            }).should.be.false;

        });
    });
});
