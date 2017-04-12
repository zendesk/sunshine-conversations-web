import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';

import { mockComponent, findRenderedDOMComponentsWithId, wrapComponentWithStore } from '../../utils/react';
import { createMockedStore } from '../../utils/redux';

import { Header } from '../../../src/js/components/header';
import { Settings } from '../../../src/js/components/settings';
import { Conversation } from '../../../src/js/components/conversation';
import { ChatInput } from '../../../src/js/components/chat-input';
import { ErrorNotification } from '../../../src/js/components/error-notification';
import { Widget } from '../../../src/js/components/widget';
import { Channel } from '../../../src/js/components/channels/channel';
import { MessengerButton } from '../../../src/js/components/messenger-button';
import { MessageIndicator } from '../../../src/js/components/message-indicator';

import * as appUtils from '../../../src/js/utils/app';
import { WIDGET_STATE } from '../../../src/js/constants/app';

function getStoreState(state = {}) {
    const defaultState = {
        user: {
            _id: '12345',
            email: 'some@email.com'
        },
        appState: {
            widgetState: WIDGET_STATE.CLOSED,
            settingsVisible: false,
            embedded: false,
            showAnimation: false,
            typingIndicatorShown: false
        },
        app: {
            settings: {
                web: {
                    displayStyle: 'button',
                    accentColor: '#009933'
                }
            }
        },
        conversation: {
            unreadCount: 0
        },
        ui: {
            text: {
                messageIndicatorTitle: ''
            }
        }
    };

    // appState is cloned on its own because `widgetState` is a Symbol
    // and `deep-assign` has trouble dealing with it.
    const newAppState = {
        ...defaultState.appState,
        ...state.appState
    };

    delete defaultState.appState;
    delete state.appState;

    const newState = deepAssign(defaultState, state);

    return {
        ...newState,
        appState: newAppState
    };
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

        sandbox.stub(appUtils, 'hasChannels').returns(true);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('is closed', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState());
            component = wrapComponentWithStore(Widget, null, mockedStore);
        });

        it('should have a sk-close class', () => {
            findRenderedDOMComponentsWithId(component, 'sk-container').className.indexOf('sk-close').should.be.gt(-1);
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

        it('should have a sk-appear class', () => {
            findRenderedDOMComponentsWithId(component, 'sk-container').className.indexOf('sk-appear').should.be.gt(-1);
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
                app: {
                    settings: {
                        web: {
                            displayStyle: 'tab'
                        }
                    }
                }
            }));
            component = wrapComponentWithStore(Widget, null, mockedStore);

            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedMessengerButton').length.should.eq(0);
        });

        it('should not render the button in embedded mode', () => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    embedded: true
                },
                app: {
                    settings: {
                        web: {
                            displayStyle: 'button'
                        }
                    }
                }
            }));
            component = wrapComponentWithStore(Widget, null, mockedStore);

            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedMessengerButton').length.should.eq(0);
        });

        it('should render the button in button mode', () => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                app: {
                    settings: {
                        web: {
                            displayStyle: 'button'
                        }
                    }
                }
            }));
            component = wrapComponentWithStore(Widget, null, mockedStore);

            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedMessengerButton').length.should.eq(1);
        });

    });
});
