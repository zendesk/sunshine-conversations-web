import sinon from 'sinon';

import { createMock } from '../../mocks/core';
import { createMockedStore } from '../../utils/redux';

import * as coreService from '../../../src/js/services/core';
import * as userService from '../../../src/js/services/user';
import * as conversationService from '../../../src/js/services/conversation';
import * as userActions from '../../../src/js/actions/user-actions';

describe('User service', () => {
    let sandbox;
    let coreMock;
    let mockedStore;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        coreMock = createMock(sandbox);

        sandbox.spy(userActions, 'setUser');

        coreMock.appUsers.update.resolves({
            appUser: {
                _id: '1',
                email: 'mocked@email.com'
            }
        });

        coreMock.appUsers.update.resolves({
            appUser: {
                _id: '1',
                email: 'mocked@email.com'
            }
        });

        coreMock.appUsers.updateDevice.resolves({
            info: {
                test: true
            }
        });

        sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });

        mockedStore = createMockedStore(sandbox, {
            user: {
                _id: '1',
                email: 'some@email.com'
            }
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('updateNowViewing', () => {
        it('should call smooch-core update device api and return the device on server response', () => {
            return mockedStore.dispatch(userService.updateNowViewing('blap')).then(() => {
                coreMock.appUsers.updateDevice.should.have.been.calledWith('1', 'blap', {
                    info: {
                        currentUrl: document.location.href,
                        currentTitle: document.title
                    }
                });
            });
        });
    });

    describe('immediateUpdate', () => {
        describe('is not dirty', () => {
            it('should do nothing', () => {
                const props = {
                    email: 'some@email.com'
                };

                return mockedStore.dispatch(userService.immediateUpdate(props)).then(() => {
                    coreMock.appUsers.update.should.not.have.been.called;
                });
            });
        });

        describe('is dirty', () => {
            it('should call smooch-core update api and update the store on server response', () => {
                const props = {
                    email: 'other@email.com'
                };

                return mockedStore.dispatch(userService.immediateUpdate(props)).then((response) => {
                    coreMock.appUsers.update.should.have.been.calledWith('1', {
                        email: 'other@email.com'
                    });

                    // the values here are different because these are values
                    // returned by the server and mocked in the beforeEach
                    response.should.deep.eq({
                        appUser: {
                            _id: '1',
                            email: 'mocked@email.com'
                        }
                    });
                    userActions.setUser.should.have.been.calledWith({
                        _id: '1',
                        email: 'mocked@email.com'
                    });
                });
            });
        });
    });

    describe('trackEvent', () => {
        describe('conversation updated', () => {
            beforeEach(() => {
                coreMock.appUsers.trackEvent.resolves({
                    conversationUpdated: true
                });

                sandbox.stub(conversationService, 'handleConversationUpdated');
                conversationService.handleConversationUpdated.returns(() => Promise.resolve());
            });

            it('should call getConversation and connectFaye', () => {
                return mockedStore.dispatch(userService.trackEvent('event', 'props')).then(() => {
                    coreMock.appUsers.trackEvent.should.have.been.calledWith('1', 'event', 'props');
                    conversationService.handleConversationUpdated.should.have.been.calledOnce;
                });
            });
        });

        describe('conversation not updated', () => {
            beforeEach(() => {
                coreMock.appUsers.trackEvent.resolves({
                    conversationUpdated: false
                });

                sandbox.stub(conversationService, 'handleConversationUpdated');
                conversationService.handleConversationUpdated.returns(() => Promise.resolve());
            });

            it('should call getConversation and connectFaye', () => {
                return mockedStore.dispatch(userService.trackEvent('event', 'props')).then(() => {
                    coreMock.appUsers.trackEvent.should.have.been.calledWith('1', 'event', 'props');
                    conversationService.handleConversationUpdated.should.not.have.been.called;
                });
            });
        });
    });

    // skip these untils fake timers weirdness is resolved.
    describe.skip('update', () => {
        beforeEach(() => {
            sandbox.useFakeTimers();
        });

        it('should call immediateUpdate', () => {
            const props = {
                email: 'email'
            };

            const promise = mockedStore.dispatch(userService.update(props));
            sandbox.clock.tick(1);
            return promise.then(() => {
                coreMock.appUsers.update.should.have.been.calledWith('1', props);
            });
        });

        it('should be throttled for 5 sec', () => {
            const props = {
                email: 'email'
            };

            const promise = mockedStore.dispatch(userService.update(props));
            sandbox.clock.tick(1);
            return promise.then(() => {
                coreMock.appUsers.update.should.have.been.calledWith('1', props);
                coreMock.appUsers.update.reset();
            }).then(() => {
                const throttledPromise = mockedStore.dispatch(userService.update(props));
                sandbox.clock.tick(4998);
                return throttledPromise.then(() => {
                    coreMock.appUsers.update.should.not.have.been.called;
                });
            }).then(() => {
                const unthrottledPromise = mockedStore.dispatch(userService.update(props));
                sandbox.clock.tick(1);
                return unthrottledPromise.then(() => {
                    coreMock.appUsers.update.should.have.been.calledWith('1', props);
                });
            });

        });


        it('should merge props when throttling and reset for the next call', () => {
            const promise = mockedStore.dispatch(userService.update({
                email: 'this@email.com'
            }));

            // needs to tick one for the internal promise mechanism to work
            sandbox.clock.tick(1);
            return promise.then(() => {
                coreMock.appUsers.update.should.have.been.calledWith('1', {
                    email: 'this@email.com'
                });
            }).then(() => {
                const throttledPromise = mockedStore.dispatch(userService.update({
                    givenName: 'Example'
                }));

                // move just under 5000 ms
                sandbox.clock.tick(4998);

                return throttledPromise.then(() => {
                    coreMock.appUsers.update.should.not.have.been.called;
                });
            }).then(() => {
                const unthrottledPromise = mockedStore.dispatch(userService.update({
                    email: 'another@email.com'
                }));

                // move up to 5000
                sandbox.clock.tick(1);

                return unthrottledPromise.then(() => {
                    coreMock.appUsers.update.should.have.been.calledWith('1', {
                        givenName: 'Example',
                        email: 'another@email.com'
                    });
                });
            }).then(() => {
                // move to an unthrottled timeframe
                sandbox.clock.tick(20000);

                const unthrottledPromise = mockedStore.dispatch(userService.update({
                    email: 'yetanother@email.com'
                }));
                sandbox.clock.tick(1);
                return unthrottledPromise.then(() => {
                    coreMock.appUsers.update.should.have.been.calledWith('1', {
                        email: 'yetanother@email.com'
                    });
                });
            });
        });
    });
});
