import sinon from 'sinon';
import { getMock } from 'test/mocks/core';
import { getMockedStore } from 'test/utils/redux';
import * as coreService from 'services/core';
import * as userService from 'services/user-service';

const AppStore = require('stores/app-store');

const store = AppStore.store;

function mockStore(s, state = {}) {
    var mockedStore = getMockedStore(s, state);

    Object.defineProperty(AppStore, 'store', {
        get: () => {
            return mockedStore;
        }
    });

    return mockedStore;
}

describe('User service', () => {
    var sandbox;
    var coreMock;
    var coreStub;
    var mockedStore;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    after(() => {
        Object.defineProperty(AppStore, 'store', {
            get: () => {
                return store;
            }
        });
    });

    beforeEach(() => {
        coreMock = getMock(sandbox);

        coreMock.appUsers.update.resolves({
            appUser: {
                _id: '1',
                email: 'mocked@email.com'
            }
        });

        coreStub = sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });

        mockedStore = mockStore(sandbox, {
            user: {
                _id: '1'
            }
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('immediateUpdate', () => {
        it('should call smooch-core update api and update the store on server response', () => {
            let props = {
                email: 'some@email.com'
            };

            return userService.immediateUpdate(props).then((response) => {
                coreMock.appUsers.update.should.have.been.calledWith('1', {
                    email: 'some@email.com'
                });

                // the values here are different because these are values
                // returned by the server and mocked in the beforeEach
                response.should.deep.eq({
                    appUser: {
                        _id: '1',
                        email: 'mocked@email.com'
                    }
                });
                mockedStore.dispatch.should.have.been.calledWith({
                    type: 'SET_USER',
                    user: {
                        _id: '1',
                        email: 'mocked@email.com'
                    }
                });
            });
        });
    });

    describe('update', () => {
        beforeEach(() => {
            sandbox.useFakeTimers();
        });

        afterEach(() => {
            // advance the clock to reset the throttling stuff
            sandbox.clock.tick(50000);
        });

        it('should call immediateUpdate', () => {
            let props = {
                email: 'email'
            };

            let promise = userService.update(props);
            sandbox.clock.tick(1);
            promise.then(() => {
                coreMock.appUsers.update.should.have.been.calledWith('1', props);
            });
        });

        it('should be throttled for 5 sec', () => {
            let props = {
                email: 'email'
            };

            let promise = userService.update(props);
            sandbox.clock.tick(1);
            promise.then(() => {
                coreMock.appUsers.update.should.have.been.calledWith('1', props);
                coreMock.appUsers.update.reset();
            });

            let throttledPromise = userService.update(props);
            sandbox.clock.tick(4998);
            throttledPromise.then(() => {
                coreMock.appUsers.update.should.not.have.been.called;
            });

            let unthrottledPromise = userService.update(props);
            sandbox.clock.tick(1);
            unthrottledPromise.then(() => {
                coreMock.appUsers.update.should.have.been.calledWith('1', props);
            });
        });


        it('should merge props when throttling and reset for the next call', () => {
            let promise = userService.update({
                email: 'this@email.com'
            });

            // needs to tick one for the internal promise mechanism to work
            sandbox.clock.tick(1);
            promise.then(() => {
                coreMock.appUsers.update.should.have.been.calledWith('1', {
                    email: 'this@email.com'
                });
            });

            let throttledPromise = userService.update({
                givenName: 'Example'
            });

            // move just under 5000 ms
            sandbox.clock.tick(4998);

            throttledPromise.then(() => {
                coreMock.appUsers.update.should.not.have.been.called;
            });

            let unthrottledPromise = userService.update({
                email: 'another@email.com'
            });

            // move up to 5000
            sandbox.clock.tick(1);

            unthrottledPromise.then(() => {
                coreMock.appUsers.update.should.have.been.calledWith('1', {
                    givenName: 'Example',
                    email: 'another@email.com'
                });
            });

            // move to an unthrottled timeframe
            sandbox.clock.tick(20000);

            unthrottledPromise = userService.update({
                email: 'yetanother@email.com'
            });
            sandbox.clock.tick(1);
            unthrottledPromise.then(() => {
                coreMock.appUsers.update.should.have.been.calledWith('1', {
                    email: 'yetanother@email.com'
                });
            });
        });
    });
});
