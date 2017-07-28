import sinon from 'sinon';

import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';

import * as userActions from '../../../src/frame/js/actions/user';
import { __Rewire__ as UserRewire } from '../../../src/frame/js/actions/user';

describe('User Actions', () => {
    let sandbox;
    let mockedStore;
    let setUserSpy;
    let httpStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        httpStub = sandbox.stub().returnsAsyncThunk({
            value: {
                response: {
                    status: 200
                },
                appUser: {
                    _id: '1',
                    email: 'mocked@email.com'
                }
            }
        });
        UserRewire('http', httpStub);

        setUserSpy = sandbox.spy(userActions.setUser);
        UserRewire('setUser', setUserSpy);

        mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
            user: {
                _id: '1',
                email: 'some@email.com'
            }
        }));
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('immediateUpdate', () => {
        describe('is not dirty', () => {
            it('should do nothing', () => {
                const props = {
                    email: 'some@email.com'
                };

                return mockedStore.dispatch(userActions.immediateUpdate(props)).then(() => {
                    httpStub.should.not.have.been.called;
                });
            });
        });

        describe('is dirty', () => {
            it('should call smooch-core update api and update the store on server response', () => {
                const props = {
                    email: 'other@email.com'
                };
                const {config: {appId}, user: {_id}} = mockedStore.getState();
                return mockedStore.dispatch(userActions.immediateUpdate(props)).then((response) => {
                    httpStub.should.have.been.calledWith('PUT', `/apps/${appId}/appusers/${_id}`, {
                        email: 'other@email.com'
                    });

                    // the values here are different because these are values
                    // returned by the server and mocked in the beforeEach
                    response.appUser.should.deep.eq({
                        _id: '1',
                        email: 'mocked@email.com'
                    });


                    setUserSpy.should.have.been.calledWith({
                        _id: '1',
                        email: 'mocked@email.com'
                    });
                });
            });
        });
    });

    // skip these untils fake timers weirdness is resolved.
    describe.skip('update', () => {
        let immediateUpdateStub;
        beforeEach(() => {
            sandbox.useFakeTimers();
            immediateUpdateStub = sandbox.stub().returnsAsyncThunk();
            UserRewire('immediateUpdate', immediateUpdateStub);
        });

        it('should call immediateUpdate', () => {
            const props = {
                email: 'email'
            };

            const promise = mockedStore.dispatch(userActions.update(props));
            sandbox.clock.tick(1);
            return promise.then(() => {
                immediateUpdateStub.should.have.been.calledWith(props);
            });
        });

        it('should be throttled for 5 sec', () => {
            const props = {
                email: 'email'
            };

            const promise = mockedStore.dispatch(userActions.update(props));
            sandbox.clock.tick(1);
            return promise.then(() => {
                immediateUpdateStub.should.have.been.calledWith(props);
                immediateUpdateStub.reset();
            }).then(() => {
                const throttledPromise = mockedStore.dispatch(userActions.update(props));
                sandbox.clock.tick(4998);
                return throttledPromise.then(() => {
                    immediateUpdateStub.should.not.have.been.called;
                });
            }).then(() => {
                const unthrottledPromise = mockedStore.dispatch(userActions.update(props));
                sandbox.clock.tick(1);
                return unthrottledPromise.then(() => {
                    immediateUpdateStub.should.have.been.calledWith(props);
                });
            });

        });


        it('should merge props when throttling and reset for the next call', () => {
            const promise = mockedStore.dispatch(userActions.update({
                email: 'this@email.com'
            }));

            // needs to tick one for the internal promise mechanism to work
            sandbox.clock.tick(1);
            return promise.then(() => {
                immediateUpdateStub.should.have.been.calledWith({
                    email: 'this@email.com'
                });
            }).then(() => {
                const throttledPromise = mockedStore.dispatch(userActions.update({
                    givenName: 'Example'
                }));

                // move just under 5000 ms
                sandbox.clock.tick(4998);

                return throttledPromise.then(() => {
                    immediateUpdateStub.should.not.have.been.called;
                });
            }).then(() => {
                const unthrottledPromise = mockedStore.dispatch(userActions.update({
                    email: 'another@email.com'
                }));

                // move up to 5000
                sandbox.clock.tick(1);

                return unthrottledPromise.then(() => {
                    immediateUpdateStub.should.have.been.calledWith({
                        givenName: 'Example',
                        email: 'another@email.com'
                    });
                });
            }).then(() => {
                // move to an unthrottled timeframe
                sandbox.clock.tick(20000);

                const unthrottledPromise = mockedStore.dispatch(userActions.update({
                    email: 'yetanother@email.com'
                }));
                sandbox.clock.tick(1);
                return unthrottledPromise.then(() => {
                    immediateUpdateStub.should.have.been.calledWith({
                        email: 'yetanother@email.com'
                    });
                });
            });
        });
    });
});
