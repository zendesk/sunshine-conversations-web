import sinon from 'sinon';
import hat from 'hat';

import { createMock as createThrottleMock } from '../../mocks/throttle';
import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';

import * as integrationsActions from '../../../src/frame/js/actions/integrations';
import { __Rewire__ as IntegrationsRewire, updateSMSAttributes, setTransferRequestCode, setWeChatQRCode, setViberQRCode } from '../../../src/frame/js/actions/integrations';
import { updateUser } from '../../../src/frame/js/actions/user';

describe('Integrations Actions', () => {
    let sandbox;

    let appUserId;
    let httpStub;
    let startConversationStub;
    let mockedStore;
    let updateUserSpy;
    let handleConversationUpdatedStub;
    let subscribeFayeStub;
    let updateSMSAttributesSpy;
    let setTransferRequestCodeSpy;
    let setWeChatQRCodeSpy;
    let setViberQRCodeSpy;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        // Disable throttling for unit tests
        IntegrationsRewire('Throttle', createThrottleMock(sandbox));

        httpStub = sandbox.stub().returnsAsyncThunk();
        IntegrationsRewire('http', httpStub);

        startConversationStub = sandbox.stub().returnsAsyncThunk();
        IntegrationsRewire('startConversation', startConversationStub);

        updateUserSpy = sandbox.spy(updateUser);
        IntegrationsRewire('updateUser', updateUserSpy);

        updateSMSAttributesSpy = sandbox.spy(updateSMSAttributes);
        IntegrationsRewire('updateSMSAttributes', updateSMSAttributesSpy);

        setTransferRequestCodeSpy = sandbox.spy(setTransferRequestCode);
        IntegrationsRewire('setTransferRequestCode', setTransferRequestCodeSpy);

        setWeChatQRCodeSpy = sandbox.spy(setWeChatQRCode);
        IntegrationsRewire('setWeChatQRCode', setWeChatQRCodeSpy);

        setViberQRCodeSpy = sandbox.spy(setViberQRCode);
        IntegrationsRewire('setViberQRCode', setViberQRCodeSpy);

        handleConversationUpdatedStub = sandbox.stub().returnsAsyncThunk();
        IntegrationsRewire('handleConversationUpdated', handleConversationUpdatedStub);

        subscribeFayeStub = sandbox.stub().returnsAsyncThunk();
        IntegrationsRewire('subscribeFaye', subscribeFayeStub);

        appUserId = hat();
        mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
            user: {
                _id: appUserId
            }
        }));
    });

    afterEach(() => {
        sandbox.restore();
    });

    function mockStartConversation(appUserId, conversationId) {
        startConversationStub.callsFake(() => {
            mockedStore.getState().user._id = appUserId;
            mockedStore.getState().conversation._id = conversationId;

            return () => Promise.resolve();
        });
    }

    describe('linkSMSChannel', () => {
        let conversationId;
        let createdClient;

        beforeEach(() => {
            conversationId = hat();
            createdClient = {
                id: hat()
            };
        });

        describe('when the user exists', () => {
            beforeEach(() => {
                httpStub.returnsAsyncThunk({
                    value: {
                        client: createdClient
                    }
                });

                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    user: {
                        _id: appUserId
                    },
                    conversation: {
                        _id: conversationId
                    }
                }));
            });

            it('should set the twilio integration to pending state', () => {
                const {config: {appId}} = mockedStore.getState();

                return mockedStore.dispatch(integrationsActions.linkSMSChannel({
                    type: 'twilio',
                    phoneNumber: '+0123456789'
                }))
                    .then(() => {
                        httpStub.should.have.been.calledOnce;
                        httpStub.should.have.been.calledWith('POST', `/apps/${appId}/appusers/${appUserId}/clients`, {
                            criteria: {
                                type: 'twilio',
                                phoneNumber: '+0123456789'
                            },
                            confirmation: {
                                type: 'prompt'
                            },
                            target: {
                                conversationId
                            }
                        });

                        updateUserSpy.should.have.been.calledOnce;
                        updateUserSpy.should.have.been.calledWith({
                            pendingClients: [createdClient]
                        });

                        updateSMSAttributesSpy.should.have.been.calledOnce;
                        updateSMSAttributesSpy.should.have.been.calledWith({
                            linkState: 'pending'
                        }, 'twilio');

                        subscribeFayeStub.should.have.been.calledOnce;
                        startConversationStub.should.not.have.been.called;
                    });
            });
        });

        describe('when the user does not exist', () => {
            beforeEach(() => {
                mockStartConversation(appUserId, conversationId);
                httpStub.returnsAsyncThunk({
                    value: {
                        client: createdClient
                    }
                });

                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({}));
            });


            it('should create the user and link twilio', () => {
                const {config: {appId}} = mockedStore.getState();

                return mockedStore.dispatch(integrationsActions.linkSMSChannel({
                    type: 'twilio',
                    phoneNumber: '+0123456789'
                }))
                    .then(() => {
                        startConversationStub.should.have.been.calledOnce;

                        httpStub.should.have.been.calledOnce;
                        httpStub.should.have.been.calledWith('POST', `/apps/${appId}/appusers/${appUserId}/clients`, {
                            criteria: {
                                type: 'twilio',
                                phoneNumber: '+0123456789'
                            },
                            confirmation: {
                                type: 'prompt'
                            },
                            target: {
                                conversationId
                            }
                        });

                        updateUserSpy.should.have.been.calledOnce;
                        updateUserSpy.should.have.been.calledWith({
                            pendingClients: [createdClient]
                        });

                        updateSMSAttributesSpy.should.have.been.calledOnce;
                        updateSMSAttributesSpy.should.have.been.calledWith({
                            linkState: 'pending'
                        }, 'twilio');

                        subscribeFayeStub.should.not.have.been.called;
                    });
            });
        });
    });

    describe('unlinkSMSChannel', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                user: {
                    _id: '1',
                    clients: [
                        {
                            platform: 'twilio',
                            id: 'twilio-client'
                        }
                    ],
                    pendingClients: []
                }
            }));
        });

        it('should set the sms integration state to unlinked', () => {
            const {config: {appId}, user: {_id}} = mockedStore.getState();
            return mockedStore.dispatch(integrationsActions.unlinkSMSChannel('twilio')).then(() => {
                httpStub.should.have.been.calledWith('DELETE', `/apps/${appId}/appusers/${_id}/clients/twilio-client`);
            });
        });
    });

    describe('pingSMSChannel', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                user: {
                    _id: '1',
                    clients: [
                        {
                            platform: 'twilio',
                            id: 'twilio-client'
                        }
                    ],
                    pendingClients: []
                }
            }));
        });

        it('should call the ping channel API', () => {
            const {config: {appId}, user: {_id}} = mockedStore.getState();
            return mockedStore.dispatch(integrationsActions.pingSMSChannel('twilio')).then(() => {
                httpStub.should.have.been.calledWith('POST', `/apps/${appId}/appusers/${_id}/clients/twilio-client/ping`);
            });
        });
    });

    describe('fetchTransferRequestCode', () => {
        let integrations;
        let appUserId;

        beforeEach(() => {
            integrations = [{
                type: 'messenger',
                _id: 'messenger-integration'
            }];
            appUserId = hat();

            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                config: {
                    integrations
                },
                user: {
                    _id: appUserId
                }
            }));

            httpStub.returnsAsyncThunk({
                value: {
                    transferRequests: [{
                        code: '1234'
                    }]
                }
            });
        });

        it('should abort if the integration doesnt exist', () => {
            const channel = hat();

            return mockedStore.dispatch(integrationsActions.fetchTransferRequestCode(channel))
                .then(() => {
                    subscribeFayeStub.should.not.have.been.called;
                    httpStub.should.not.have.been.called;
                    setTransferRequestCodeSpy.should.not.have.been.called;
                });
        });

        describe('when the user exists', () => {
            it('should call the transferrequest API', () => {
                const channel = 'messenger';
                const {config: {appId}} = mockedStore.getState();
                return mockedStore.dispatch(integrationsActions.fetchTransferRequestCode(channel))
                    .then(() => {
                        subscribeFayeStub.should.have.been.calledOnce;
                        startConversationStub.should.not.have.been.called;

                        httpStub.should.have.been.calledWith('GET', `/apps/${appId}/appusers/${appUserId}/transferrequest`, {
                            type: channel,
                            integrationId: 'messenger-integration'
                        });

                        setTransferRequestCodeSpy.should.have.been.calledOnce;
                        setTransferRequestCodeSpy.should.have.been.calledWith(channel, '1234');
                    });
            });
        });

        describe('when the user does not exist', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    config: {
                        integrations
                    }
                }));

                mockStartConversation(appUserId, hat());
            });

            it('should call the transferrequest API', () => {
                const channel = 'messenger';
                const {config: {appId}} = mockedStore.getState();
                return mockedStore.dispatch(integrationsActions.fetchTransferRequestCode(channel))
                    .then(() => {
                        startConversationStub.should.have.been.calledOnce;
                        subscribeFayeStub.should.not.have.been.calledOnce;

                        httpStub.should.have.been.calledWith('GET', `/apps/${appId}/appusers/${appUserId}/transferrequest`, {
                            type: channel,
                            integrationId: 'messenger-integration'
                        });

                        setTransferRequestCodeSpy.should.have.been.calledOnce;
                        setTransferRequestCodeSpy.should.have.been.calledWith(channel, '1234');
                    });
            });
        });
    });

    describe('fetchWeChatQRCode', () => {
        let integrations;
        let appUserId;
        let url;

        beforeEach(() => {
            integrations = [{
                type: 'wechat',
                _id: hat()
            }];
            appUserId = hat();
            url = hat();

            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                config: {
                    integrations
                },
                user: {
                    _id: appUserId
                },
                integrations: {
                    wechat: {}
                }
            }));

            httpStub.returnsAsyncThunk({
                value: {
                    url
                }
            });
        });

        it('should abort if the integration doesnt exist', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                config: {
                    integrations: []
                },
                integrations: {
                    wechat: {}
                }
            }));

            return mockedStore.dispatch(integrationsActions.fetchWeChatQRCode())
                .then(() => {
                    subscribeFayeStub.should.not.have.been.called;
                    httpStub.should.not.have.been.called;
                    setWeChatQRCodeSpy.should.not.have.been.called;
                });
        });

        it('should abort if a qr code has been fetched', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                config: {
                    integrations
                },
                integrations: {
                    wechat: {
                        qrCode: hat()
                    }
                }
            }));

            return mockedStore.dispatch(integrationsActions.fetchWeChatQRCode())
                .then(() => {
                    subscribeFayeStub.should.not.have.been.called;
                    httpStub.should.not.have.been.called;
                    setWeChatQRCodeSpy.should.not.have.been.called;
                });
        });

        describe('when the user exists', () => {
            it('should call the qr code API', () => {
                const {config: {appId}} = mockedStore.getState();

                return mockedStore.dispatch(integrationsActions.fetchWeChatQRCode())
                    .then(() => {
                        subscribeFayeStub.should.have.been.calledOnce;
                        startConversationStub.should.not.have.been.called;

                        httpStub.should.have.been.calledWith('GET', `/apps/${appId}/appusers/${appUserId}/integrations/${integrations[0]._id}/qrcode`);

                        setWeChatQRCodeSpy.should.have.been.calledOnce;
                        setWeChatQRCodeSpy.should.have.been.calledWith(url);
                    });
            });
        });

        describe('when the user does not exist', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    config: {
                        integrations
                    },
                    integrations: {
                        wechat: {}
                    }
                }));

                mockStartConversation(appUserId, hat());
            });

            it('should call the qr code API', () => {
                const {config: {appId}} = mockedStore.getState();

                return mockedStore.dispatch(integrationsActions.fetchWeChatQRCode())
                    .then(() => {
                        startConversationStub.should.have.been.calledOnce;
                        subscribeFayeStub.should.not.have.been.calledOnce;

                        httpStub.should.have.been.calledWith('GET', `/apps/${appId}/appusers/${appUserId}/integrations/${integrations[0]._id}/qrcode`);

                        setWeChatQRCodeSpy.should.have.been.calledOnce;
                        setWeChatQRCodeSpy.should.have.been.calledWith(url);
                    });
            });
        });
    });

    describe('fetchViberQRCode', () => {
        let integrations;
        let appUserId;
        let url;

        beforeEach(() => {
            integrations = [{
                type: 'viber',
                _id: hat()
            }];
            appUserId = hat();
            url = hat();

            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                config: {
                    integrations
                },
                user: {
                    _id: appUserId
                },
                integrations: {
                    viber: {}
                }
            }));

            httpStub.returnsAsyncThunk({
                value: {
                    url
                }
            });
        });

        it('should abort if the integration doesnt exist', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                config: {
                    integrations: []
                },
                integrations: {
                    viber: {}
                }
            }));

            return mockedStore.dispatch(integrationsActions.fetchViberQRCode())
                .then(() => {
                    subscribeFayeStub.should.not.have.been.called;
                    httpStub.should.not.have.been.called;
                    setViberQRCodeSpy.should.not.have.been.called;
                });
        });

        it('should abort if a qr code has been fetched', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                config: {
                    integrations
                },
                integrations: {
                    viber: {
                        qrCode: hat()
                    }
                }
            }));

            return mockedStore.dispatch(integrationsActions.fetchViberQRCode())
                .then(() => {
                    subscribeFayeStub.should.not.have.been.called;
                    httpStub.should.not.have.been.called;
                    setViberQRCodeSpy.should.not.have.been.called;
                });
        });

        describe('when the user exists', () => {
            it('should call the qr code API', () => {
                const {config: {appId}} = mockedStore.getState();

                return mockedStore.dispatch(integrationsActions.fetchViberQRCode())
                    .then(() => {
                        subscribeFayeStub.should.have.been.calledOnce;
                        startConversationStub.should.not.have.been.called;

                        httpStub.should.have.been.calledWith('GET', `/apps/${appId}/appusers/${appUserId}/integrations/${integrations[0]._id}/qrcode`);

                        setViberQRCodeSpy.should.have.been.calledOnce;
                        setViberQRCodeSpy.should.have.been.calledWith(url);
                    });
            });
        });

        describe('when the user does not exist', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    config: {
                        integrations
                    },
                    integrations: {
                        viber: {}
                    }
                }));

                mockStartConversation(appUserId, hat());
            });

            it('should call the qr code API', () => {
                const {config: {appId}} = mockedStore.getState();

                return mockedStore.dispatch(integrationsActions.fetchViberQRCode())
                    .then(() => {
                        startConversationStub.should.have.been.calledOnce;
                        subscribeFayeStub.should.not.have.been.calledOnce;

                        httpStub.should.have.been.calledWith('GET', `/apps/${appId}/appusers/${appUserId}/integrations/${integrations[0]._id}/qrcode`);

                        setViberQRCodeSpy.should.have.been.calledOnce;
                        setViberQRCodeSpy.should.have.been.calledWith(url);
                    });
            });
        });
    });
});
