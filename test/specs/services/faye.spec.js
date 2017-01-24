import sinon from 'sinon';
import { Client } from 'faye';

import { createMockedStore } from '../../utils/redux';
import * as utilsDevice from '../../../src/js/utils/device';
import * as userActions from '../../../src/js/actions/user-actions';
import * as fayeActions from '../../../src/js/actions/faye-actions';
import * as conversationActions from '../../../src/js/actions/conversation-actions';
import * as conversationService from '../../../src/js/services/conversation';
import * as fayeService from '../../../src/js/services/faye';
import * as appService from '../../../src/js/services/app';

function getProps(props = {}) {
    const state = {
        user: {
            conversationStarted: true
        },
        faye: {
            subscription: false
        },
        appState: {
            serverUrl: 'http://localhost'
        },
        conversation: {
            messages: []
        }
    };
    return Object.assign({}, state, props);
}

const sandbox = sinon.sandbox.create();

describe('Faye service', () => {
    let mockedStore;

    beforeEach(() => {
        mockedStore = createMockedStore(sandbox, getProps());

        sandbox.stub(Client.prototype, 'addExtension');
        sandbox.stub(conversationService, 'getMessages');
        sandbox.stub(conversationService, 'disconnectFaye');
        sandbox.stub(conversationService, 'handleConversationUpdated');
        sandbox.stub(appService, 'showSettings');
        sandbox.stub(appService, 'hideChannelPage');
        sandbox.stub(appService, 'hideConnectNotification');

        sandbox.stub(conversationActions, 'addMessage');
        sandbox.stub(conversationActions, 'incrementUnreadCount');
        sandbox.stub(conversationActions, 'resetUnreadCount');
        sandbox.stub(userActions, 'setUser');
        sandbox.stub(fayeActions, 'setFayeConversationSubscription');
        sandbox.stub(fayeActions, 'setFayeUserSubscription');

        sandbox.stub(utilsDevice, 'getDeviceId').returns(123);
    });

    afterEach(() => {
        fayeService.disconnectClient();
        sandbox.restore();
    });

    describe('getClient', () => {
        beforeEach(() => {
            sandbox.stub(Client.prototype, 'subscribe', function() {
                this._events['transport:up']();
            });
        });
        describe('when conversation is started', () => {
            it('should call getMessages when transport:up event is emitted', () => {
                const client = mockedStore.dispatch(fayeService.getClient());
                client.subscribe();
                conversationService.getMessages.should.have.been.calledOnce;
            });
        });

        describe('when conversation is not started', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, getProps({
                    user: {
                        conversationStarted: false
                    }
                }));
            });

            it('should not call getMessages when transport:up event is emitted', () => {
                const client = mockedStore.dispatch(fayeService.getClient());
                client.subscribe();
                conversationService.getMessages.should.not.have.been.called;
            });
        });
    });

    describe('handleConversationSubscription', () => {
        describe('message from different device', () => {
            it('should add the message', () => {
                const message = {
                    source: {
                        id: 1
                    }
                };
                mockedStore.dispatch(fayeService.handleConversationSubscription(message));
                conversationActions.addMessage.should.have.been.calledWithMatch(message);
            });

            [true, false].forEach((appUser) => {
                describe(`message ${appUser ? '' : 'not'} from appUser`, () => {
                    it(`should ${appUser ? '' : 'not'} reset unread count`, () => {
                        const message = {
                            source: {
                                id: 1
                            },
                            role: appUser ? 'appUser' : 'appMaker'
                        };
                        mockedStore.dispatch(fayeService.handleConversationSubscription(message));
                        appUser ? conversationActions.resetUnreadCount.should.have.been.calledOnce : conversationActions.resetUnreadCount.should.not.have.been.called;
                    });
                });
            });
        });

        [true, false].forEach((appUser) => {
            describe(`message ${appUser ? '' : 'not'} from appUser`, () => {
                it(`should ${appUser ? 'not' : ''} increment unread count`, () => {
                    const message = {
                        source: {
                            id: 123
                        },
                        role: appUser ? 'appUser' : 'appMaker'
                    };
                    mockedStore.dispatch(fayeService.handleConversationSubscription(message));
                    appUser ? conversationActions.incrementUnreadCount.should.not.have.been.called : conversationActions.incrementUnreadCount.should.have.been.calledOnce;
                });
            });
        });
    });

    describe('subscribeConversation', () => {
        it('should call setFayeConversationSubcription', () => {
            mockedStore = createMockedStore(sandbox, getProps({
                conversation: {
                    _id: 123
                }
            }));
            mockedStore.dispatch(fayeService.subscribeConversation()).then(() => {
                fayeActions.setFayeConversationSubscription.should.have.been.calledOnce;
            });
        });
    });

    describe('updateUser', () => {
        let currentAppUser;
        let nextAppUser;
        describe('different appUser', () => {
            beforeEach(() => {
                currentAppUser = {
                    _id: 1
                };
                nextAppUser = {
                    _id: 2
                };
            });

            it('should subscribe new user', () => {
                mockedStore.dispatch(fayeService.updateUser(currentAppUser, nextAppUser));
                appService.hideChannelPage.should.have.been.calledOnce;
                conversationService.disconnectFaye.should.have.been.calledOnce;
                userActions.setUser.should.have.been.calledWithMatch(nextAppUser);
            });
        });

        describe('same appUser', () => {
            beforeEach(() => {
                currentAppUser = {
                    _id: 1
                };
                nextAppUser = {
                    _id: 1
                };
            });
            describe('current appUser started conversation', () => {
                it('should fetch conversation', () => {
                    currentAppUser.conversationStarted = true;
                    mockedStore.dispatch(fayeService.updateUser(currentAppUser, nextAppUser));
                    conversationService.getMessages.should.have.been.calledOnce;
                });
            });
            describe('next appUser started conversation', () => {
                it('should connect faye and fetch covnersation', () => {
                    nextAppUser.conversationStarted = true;
                    mockedStore.dispatch(fayeService.updateUser(currentAppUser, nextAppUser));
                    conversationService.handleConversationUpdated.should.have.been.calledOnce;
                });
            });
        });
    });

    describe('handleUserSubscription', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getProps({
                user: {
                    _id: 1
                },
                appState: {
                    visibleChannelType: 'web'
                }
            }));
        });
        describe('link event', () => {
            const event = {
                type: 'link',
                clientId: 123
            };
            [true, false].forEach((platform) => {
                describe(`platform is ${platform ? '' : 'not'} the same as visibleChannelType`, () => {
                    it(`should ${platform ? '' : 'not'} show the settings page`, () => {
                        const appUser = {
                            _id: 1,
                            clients: [
                                {
                                    id: 123,
                                    platform: platform ? 'web' : 'messenger'
                                }
                            ]
                        };
                        const req = {
                            appUser: appUser,
                            event: event
                        };

                        mockedStore.dispatch(fayeService.handleUserSubscription(req));
                        appService.hideConnectNotification.should.have.been.calledOnce;
                        platform ? appService.showSettings.should.have.been.calledOnce : appService.showSettings.should.not.have.been.called;
                    });
                });
            });
        });
    });

    describe('subscribeUser', () => {
        it('should call setFayeUserSubscription', () => {
            mockedStore = createMockedStore(sandbox, getProps());
            mockedStore.dispatch(fayeService.subscribeUser()).then(() => {
                fayeActions.setFayeUserSubscription.should.have.been.calledOnce;
            });
        });
    });

    describe('disconnectClient', () => {
        it('should disconnect', () => {
            sandbox.stub(Client.prototype, 'disconnect');
            mockedStore.dispatch(fayeService.getClient());
            fayeService.disconnectClient();
            Client.prototype.disconnect.should.have.been.calledOnce;
        });
    });
});
