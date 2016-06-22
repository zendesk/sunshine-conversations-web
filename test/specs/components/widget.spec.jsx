import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';

import { mockComponent } from '../../utils/react';
import { createMockedStore } from '../../utils/redux';

import { HeaderComponent } from '../../../src/js/components/header';
import { SettingsComponent } from '../../../src/js/components/settings';
import { ConversationComponent } from '../../../src/js/components/conversation';
import { ChatInputComponent } from '../../../src/js/components/chat-input';
import { NotificationsSettingsComponent } from '../../../src/js/components/notifications-settings';
import { WidgetComponent } from '../../../src/js/components/widget';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    user: {
        email: 'some@email.com'
    },
    appState: {
        widgetOpened: false,
        settingsVisible: false
    },
    app: {
        settings: {
            accentColor: '#009933'
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


xdescribe('Widget', () => {

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
        mockComponent(sandbox, NotificationsSettingsComponent, 'div', {
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
                    notificationMessage: 'this is a notification message'
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
                    notificationMessage: null
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
