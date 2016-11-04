import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';

import { Conversation } from '../../../src/js/components/conversation';
import { MessageComponent } from '../../../src/js/components/message';
import { Introduction } from '../../../src/js/components/introduction';
import { ConnectNotification } from '../../../src/js/components/connect-notification';

import { mockComponent, wrapComponentWithStore } from '../../utils/react';
import { mockAppStore } from '../../utils/redux';

const sandbox = sinon.sandbox.create();

function getStoreState(state = {}) {
    const defaultState = {
        app: {
            settings: {
                web: {
                    channels: {}
                }
            },
            integrations: []
        },
        ui: {
            text: {
                fetchingHistory: 'fetching-history',
                fetchHistory: 'fetch-history'
            }
        },
        appState: {
            shouldScrollToBottom: true,
            isFetchingMoreMessages: false,
            introHeight: 100,
            embedded: false
        },
        conversation: {
            messages: [
                {
                    _id: 1,
                    received: 1,
                    role: 'appMaker'
                },
                {
                    _id: 2,
                    received: 2,
                    role: 'appMaker'
                },
                {
                    _id: 3,
                    received: 3,
                    role: 'appMaker'
                },
                {
                    _id: 4,
                    received: 4,
                    role: 'appMaker'
                }
            ],
            hasMoreMessages: false
        }
    };

    return deepAssign(defaultState, state);
}

describe('Conversation Component', () => {

    let component;
    let mockedStore;

    beforeEach(() => {
        // mock it, we don't care about the rendering of those, they are covered in separate tests
        mockComponent(sandbox, MessageComponent, 'div', {
            className: 'mockedMessage'
        });
        mockComponent(sandbox, Introduction, 'div', {
            className: 'mockedIntroduction'
        });
        mockComponent(sandbox, ConnectNotification, 'div', {
            className: 'mockedConnectNotification'
        });

        mockedStore = mockAppStore(sandbox, getStoreState());
    });

    afterEach(() => {
        sandbox.restore();
        mockedStore && mockedStore.restore();
    });

    describe('render', () => {
        beforeEach(() => {
            component = wrapComponentWithStore(Conversation, null, mockedStore);
        });

        it('should generate all messages in the props', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedMessage').length.should.eq(mockedStore.getState().conversation.messages.length);
        });

        it('should render introduction text', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedIntroduction').length.should.eq(1);
        });
    });

    describe('ConnectNotification component', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, getStoreState({
                appState: {
                    connectNotificationTimestamp: 5
                }
            }));

            component = wrapComponentWithStore(Conversation, null, mockedStore);
        });

        it('should render', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedConnectNotification').length.should.eq(1);
        });
    });

    describe('Introduction component', () => {
        [true, false].forEach((hasMoreMessages) => {
            describe(`${hasMoreMessages ? '' : 'no'} more messages to fetch`, () => {
                it(`should ${hasMoreMessages ? 'not' : ''} render`, () => {
                    mockedStore = mockAppStore(sandbox, getStoreState({
                        conversation: {
                            hasMoreMessages
                        }
                    }));

                    component = wrapComponentWithStore(Conversation, null, mockedStore);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedIntroduction').length.should.eq(hasMoreMessages ? 0 : 1);
                });
            });
        });
    });
});
