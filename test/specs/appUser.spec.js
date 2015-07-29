var sinon = require('sinon'),
    AppUser = require('../../src/js/models/appUser');

var ClientScenario = require('../scenarios/clientScenario');

describe('AppUser', function() {
    var scenario,
        sandbox,
        user;

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
                var email = 'some@email.com',
                    givenName = 'Some',
                    surname = 'Name';

                var user = new AppUser({
                    email: email,
                    givenName: givenName,
                    surname: surname
                }, {
                    parse: true
                });

                user.get('email').should.equal(email);
                user.get('givenName').should.equal(givenName);
                user.get('surname').should.equal(surname);

            });
        });

        describe('with id', function() {
            it('should map the id in the attributes', function() {
                var id = '12345';

                var user = new AppUser(id, {
                    parse: true
                });

                user.id.should.equals(id);
                user.get('id').should.equals(id);
            });
        });
    });

    describe('#isDirty', function() {
        it('should mark the user as dirty after init', function() {
            var email = 'some@email.com',
                givenName = 'Some',
                surname = 'Name',
                id = '12345';

            var user = new AppUser({
                email: email,
                givenName: givenName,
                surname: surname,
                id: id
            }, {
                parse: true
            });

            user.isDirty().should.be.true;
        });

        it('should not be marked as dirty after saving', function(done) {
            var email = 'some@email.com',
                givenName = 'Some',
                surname = 'Name',
                id = '12345';

            var user = new AppUser({
                email: email,
                givenName: givenName,
                surname: surname,
                id: id
            }, {
                parse: true
            });

            sandbox.stub(user, 'save', function(attributes, options) {
                return this._save(attributes, options);
            });

            user.isDirty().should.be.true;

            user.save().then(function() {
                user.isDirty().should.be.false;
                done();
            }).fail(done);

        });

        it('should not be marked as dirty if changes are reverted', function(done) {
            var email = 'some@email.com',
                givenName = 'Some',
                surname = 'Name',
                id = '12345';

            var user = new AppUser({
                email: email,
                givenName: givenName,
                surname: surname,
                id: id
            }, {
                parse: true
            });

            sandbox.stub(user, 'save', function(attributes, options) {
                return this._save(attributes, options);
            });

            user.isDirty().should.be.true;

            user.save().then(function() {
                user.isDirty().should.be.false;

                user.set('email', 'other@email.com');

                user.isDirty().should.be.true;
                done();
            }).fail(done);

        });
    });
});
