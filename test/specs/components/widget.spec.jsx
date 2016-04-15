import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { Provider } from 'react-redux';
import { mockComponent } from 'test/utils/react';
import { createMockedStore } from 'test/utils/redux';

import { HeaderComponent } from 'components/header.jsx';
import { SettingsComponent } from 'components/settings.jsx';
import { ConversationComponent } from 'components/conversation.jsx';
import { ChatInputComponent } from 'components/chat-input.jsx';
import { NotificationComponent } from 'components/notification.jsx';
import { WidgetComponent } from 'components/widget.jsx';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    user: {
        email: 'some@email.com'
    },
    appState: {
        widgetOpened: false,
        settingsVisible: false
    },
    app: {},
    conversation: {
        unreadCount: 0
    },
    ui: {
        text: {
            messageIndicatorTitle: ''
        }
    }
};


describe('Widget', () => {

    var component;
    var componentNode;
    var store;

    beforeEach(() => {
        mockComponent(sandbox, HeaderComponent, 'div', {
            className: 'mockedHeader'
        });
        mockComponent(sandbox, ChatInputComponent, 'div', {
            className: 'mockedInput'
        });
        mockComponent(sandbox, SettingsComponent, 'div', {
            className: 'mockedSettings'
        });
        mockComponent(sandbox, ConversationComponent, 'div', {
            className: 'mockedConversation'
        });
        mockComponent(sandbox, NotificationComponent, 'div', {
            className: 'mockedNotification'
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('is closed', () => {
        const props = Object.assign({}, defaultProps);
        store = createMockedStore(sandbox, props);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                         <WidgetComponent {...props} />
                                                     </Provider>);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should have a sk-close class', () => {
            componentNode.className.should.eq('sk-close');
        });
    });

    describe('is opened', () => {
        const props = Object.assign({}, defaultProps, {
            appState: {
                widgetOpened: true
            }
        });
        store = createMockedStore(sandbox, props);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                         <WidgetComponent {...props} />
                                                     </Provider>);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should have a sk-appear class', () => {
            componentNode.className.should.eq('sk-appear');
        });
    });

    describe('conversation view', () => {
        const props = Object.assign({}, defaultProps, {
            appState: {
                widgetOpened: true
            }
        });
        store = createMockedStore(sandbox, props);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                         <WidgetComponent {...props} />
                                                     </Provider>);
            componentNode = ReactDOM.findDOMNode(component);
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
        const props = Object.assign({}, defaultProps, {
            appState: {
                widgetOpened: true,
                settingsVisible: true
            }
        });
        store = createMockedStore(sandbox, props);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                         <WidgetComponent {...props} />
                                                     </Provider>);
            componentNode = ReactDOM.findDOMNode(component);
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

    describe('notification', () => {
        describe('shown', () => {
            const props = Object.assign({}, defaultProps, {
                appState: {
                    settingsNotificationVisible: true
                }
            });

            beforeEach(() => {
                component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                             <WidgetComponent {...props} />
                                                         </Provider>);
            });

            it('should render the notification', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedNotification').length.should.eq(1);
            });
        });
        describe('hidden', () => {
            const props = Object.assign({}, defaultProps, {
                appState: {
                    settingsNotificationVisible: false
                }
            });

            beforeEach(() => {
                component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                             <WidgetComponent {...props} />
                                                         </Provider>);
            });

            it('should render the notification', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedNotification').length.should.eq(0);
            });
        });
    });
});
