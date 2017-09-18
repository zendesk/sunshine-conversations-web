import sinon from 'sinon';
import hat from 'hat';

import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';

import * as userActions from '../../../src/frame/js/actions/user';
import { __Rewire__ as UserRewire, __RewireAPI__ as UserRewireAPI } from '../../../src/frame/js/actions/user';

describe('User Actions', () => {
    let sandbox;
    let mockedStore;
    let setUserSpy;
    let httpStub;
    let email;

    beforeEach(() => {
        email = hat();

        sandbox = sinon.sandbox.create();
        httpStub = sandbox.stub().returnsAsyncThunk();
        UserRewire('http', httpStub);

        setUserSpy = sandbox.spy(userActions.setUser);
        UserRewire('setUser', setUserSpy);

        mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
            config: {
                profile: {
                    enabled: true,
                    uploadInterval: 15
                }
            },
            user: {
                _id: '1',
                email
            }
        }));

        clearTimeout(UserRewireAPI.__get__('pendingTimeout'));
        UserRewireAPI.__set__('pendingTimeout', null);
        UserRewireAPI.__set__('pendingResolve', null);
        UserRewireAPI.__set__('pendingUserProps', {});
        UserRewireAPI.__set__('lastUpdateAttempt', undefined);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('immediateUpdate', () => {
        describe('is not dirty', () => {
            it('should do nothing', () => {
                const props = {
                    email
                };

                return mockedStore.dispatch(userActions.immediateUpdate(props)).then(() => {
                    httpStub.should.not.have.been.called;
                });
            });
        });

        describe('is dirty', () => {
            it('should call api and update the store', () => {
                const props = {
                    email: hat()
                };

                const {config: {appId}, user: {_id, email}} = mockedStore.getState();

                email.should.eq(email);

                return mockedStore.dispatch(userActions.immediateUpdate(props)).then(() => {
                    httpStub.should.have.been.calledWith('PUT', `/apps/${appId}/appusers/${_id}`, {
                        email: props.email
                    });

                    setUserSpy.should.have.been.calledWithMatch({
                        _id: '1',
                        email: props.email
                    });
                });
            });

            it('should not update if profile updates are disabled', () => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    config: {
                        profile: {
                            enabled: false
                        }
                    },
                    user: {
                        _id: '1',
                        email
                    }
                }));

                const props = {
                    email: hat()
                };

                return mockedStore.dispatch(userActions.immediateUpdate(props)).then(() => {
                    httpStub.should.not.have.been.called;
                });
            });
        });
    });

    describe('update', () => {
        let immediateUpdateSpy;
        let setTimeoutStub;
        beforeEach(() => {
            setTimeoutStub = sandbox.stub(global, 'setTimeout').returns(1);

            immediateUpdateSpy = sandbox.spy(userActions.immediateUpdate);
            UserRewire('immediateUpdate', immediateUpdateSpy);
        });

        it('should ignore if the user does not exist', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                config: {
                    profile: {
                        enabled: true,
                        uploadInterval: 15
                    }
                }
            }));

            return mockedStore.dispatch(userActions.update({
                email: hat()
            }))
                .then(() => {
                    immediateUpdateSpy.should.not.have.been.called;
                    setTimeoutStub.should.not.have.been.called;
                });
        });

        it('should call immediateUpdate', () => {
            const props = {
                email: 'email'
            };

            const promise = mockedStore.dispatch(userActions.update(props));
            return promise.then(() => {
                immediateUpdateSpy.should.have.been.calledWith(props);
            });
        });

        it('should be throttled', () => {
            const props = {
                email: 'email'
            };

            const promise = mockedStore.dispatch(userActions.update(props));
            return promise
                .then(() => {
                    immediateUpdateSpy.should.have.been.calledWith(props);
                    immediateUpdateSpy.reset();

                    setTimeoutStub.should.not.have.been.called;

                    const throttledPromise = mockedStore.dispatch(userActions.update(props));

                    // timer should be started
                    setTimeoutStub.should.have.been.calledOnce;

                    immediateUpdateSpy.should.not.have.been.called;

                    const unthrottledPromise = mockedStore.dispatch(userActions.update(props));

                    // it should reuse the same timer
                    setTimeoutStub.should.have.been.calledOnce;

                    // Fulfill the timer
                    setTimeoutStub.firstCall.args[0]();

                    return Promise.all([unthrottledPromise, throttledPromise]);
                })
                .then(() => {
                    immediateUpdateSpy.should.have.been.calledOnce;
                    immediateUpdateSpy.should.have.been.calledWith(props);
                });
        });

        it('should merge props when throttling', () => {
            const promise = mockedStore.dispatch(userActions.update({
                email: 'this@email.com'
            }));

            return promise
                .then(() => {
                    immediateUpdateSpy.should.have.been.calledWith({
                        email: 'this@email.com'
                    });
                    immediateUpdateSpy.reset();
                    setTimeoutStub.should.not.have.been.called;

                    const throttledPromise = mockedStore.dispatch(userActions.update({
                        givenName: 'Example'
                    }));

                    // timer should be started
                    setTimeoutStub.should.have.been.calledOnce;

                    immediateUpdateSpy.should.not.have.been.called;

                    const unthrottledPromise = mockedStore.dispatch(userActions.update({
                        email: 'another@email.com'
                    }));

                    // it should reuse the same timer
                    setTimeoutStub.should.have.been.calledOnce;

                    // Fulfill the timer
                    setTimeoutStub.firstCall.args[0]();

                    return Promise.all([unthrottledPromise, throttledPromise]);
                })
                .then(() => {
                    immediateUpdateSpy.should.have.been.calledOnce;
                    immediateUpdateSpy.should.have.been.calledWith({
                        givenName: 'Example',
                        email: 'another@email.com'
                    });
                });
        });
    });
});
