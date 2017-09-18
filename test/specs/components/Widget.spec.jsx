import sinon from 'sinon';
import TestUtils from 'react-dom/test-utils';

import { mockComponent, findRenderedDOMComponentsWithId, wrapComponentWithStore } from '../../utils/react';
import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';

import Header from '../../../src/frame/js/components/Header';
import Settings from '../../../src/frame/js/components/Settings';
import Conversation from '../../../src/frame/js/components/Conversation';
import ChatInput from '../../../src/frame/js/components/ChatInput';
import ErrorNotification from '../../../src/frame/js/components/ErrorNotification';
import Widget, { __Rewire__ as RewireWidget } from '../../../src/frame/js/components/Widget';
import Channel from '../../../src/frame/js/components/channels/Channel';
import MessengerButton from '../../../src/frame/js/components/MessengerButton';
import MessageIndicator from '../../../src/frame/js/components/MessageIndicator';

import { WIDGET_STATE } from '../../../src/frame/js/constants/app';

function getStoreState(state = {}) {
    if (!state.config) {
        state.config = {
            style: {}
        };
    }
    return generateBaseStoreProps({
        user: {
            _id: '12345',
            email: 'some@email.com',
            ...state.user
        },
        appState: {
            widgetState: WIDGET_STATE.CLOSED,
            widgetSize: 'lg',
            settingsVisible: false,
            showAnimation: false,
            typingIndicatorShown: false,
            ...state.appState
        },
        config: {
            ...state.config,
            style: {
                displayStyle: 'button',
                accentColor: '#009933',
                ...state.config.style
            }
        },
        conversation: {
            unreadCount: 0,
            ...state.conversation
        }
    });
}

const sandbox = sinon.sandbox.create();

describe('Widget Component', () => {

    let component;
    let mockedStore;

    beforeEach(() => {
        mockComponent(sandbox, Header, 'div', {
            className: 'mockedHeader'
        });
        mockComponent(sandbox, ChatInput, 'div', {
            className: 'mockedInput'
        });
        mockComponent(sandbox, Settings, 'div', {
            className: 'mockedSettings'
        });
        mockComponent(sandbox, Conversation, 'div', {
            className: 'mockedConversation'
        });
        mockComponent(sandbox, ErrorNotification, 'div', {
            className: 'mockedErrorNotification'
        });
        mockComponent(sandbox, Channel, 'div', {
            className: 'mockedChannel'
        });
        mockComponent(sandbox, MessengerButton, 'div', {
            className: 'mockedMessengerButton'
        });
        mockComponent(sandbox, MessageIndicator, 'div', {
            className: 'mockedMessageIndicator'
        });

        RewireWidget('hasChannels', sandbox.stub().returns(true));
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('is closed', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState());
            component = wrapComponentWithStore(Widget, null, mockedStore);
        });

        it('should have a close class', () => {
            findRenderedDOMComponentsWithId(component, 'container').className.indexOf('close').should.be.gt(-1);
        });
    });

    describe('is opened', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    widgetState: WIDGET_STATE.OPENED
                }
            }));
            component = wrapComponentWithStore(Widget, null, mockedStore);
        });

        it('should have a appear class', () => {
            findRenderedDOMComponentsWithId(component, 'container').className.indexOf('appear').should.be.gt(-1);
        });
    });

    describe('conversation view', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    widgetState: WIDGET_STATE.OPENED
                }
            }));
            component = wrapComponentWithStore(Widget, null, mockedStore);
        });

        it('should render the conversation view', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedConversation').length.should.eq(1);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedSettings').length.should.eq(0);
        });

        it('should render the header', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedHeader').length.should.eq(1);
        });

        it('should render the chat input', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedInput').length.should.eq(1);
        });
    });


    describe('settings view', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    widgetState: WIDGET_STATE.OPENED,
                    settingsVisible: true
                }
            }));
            component = wrapComponentWithStore(Widget, null, mockedStore);
        });

        it('should render the settings view', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedSettings').length.should.eq(1);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedConversation').length.should.eq(1);
        });

        it('should render the header', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedHeader').length.should.eq(1);
        });

        it('should not render the chat input', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedInput').length.should.eq(0);
        });
    });

    describe('error notification', () => {
        describe('shown', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, getStoreState({
                    appState: {
                        errorNotificationMessage: 'this is a notification message'
                    }
                }));
                component = wrapComponentWithStore(Widget, null, mockedStore);
            });

            it('should render the notification', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedErrorNotification').length.should.eq(1);
            });
        });
        describe('hidden', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, getStoreState({
                    appState: {
                        errorNotificationMessage: null
                    }
                }));
                component = wrapComponentWithStore(Widget, null, mockedStore);
            });

            it('should render the notification', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedErrorNotification').length.should.eq(0);
            });
        });
    });

    describe('channels', () => {

        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState());
            component = wrapComponentWithStore(Widget, null, mockedStore);
        });

        it('should render the channels view', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedChannel').length.should.eq(1);
        });

    });

    describe('messenger button', () => {

        it('should not render the button in tab mode', () => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                config: {
                    style: {
                        displayStyle: 'tab'
                    }
                }
            }));
            component = wrapComponentWithStore(Widget, null, mockedStore);

            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedMessengerButton').length.should.eq(0);
        });

        it('should not render the button in embedded mode', () => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    widgetState: WIDGET_STATE.EMBEDDED
                },
                config: {
                    style: {
                        displayStyle: 'button'
                    }
                }
            }));
            component = wrapComponentWithStore(Widget, null, mockedStore);

            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedMessengerButton').length.should.eq(0);
        });

        it('should render the button in button mode', () => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                config: {
                    style: {
                        displayStyle: 'button'
                    }
                }
            }));
            component = wrapComponentWithStore(Widget, null, mockedStore);

            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedMessengerButton').length.should.eq(1);
        });

    });
});
