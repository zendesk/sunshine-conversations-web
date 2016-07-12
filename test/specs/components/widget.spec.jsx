import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';

import { mockComponent } from '../../utils/react';
import { createMockedStore, mockAppStore } from '../../utils/redux';

import { Header } from '../../../src/js/components/header';
import { Settings } from '../../../src/js/components/settings';
import { Conversation } from '../../../src/js/components/conversation';
import { ChatInput } from '../../../src/js/components/chat-input';
import { ErrorNotification } from '../../../src/js/components/error-notification';
import { WidgetComponent } from '../../../src/js/components/widget';
import { Channel } from '../../../src/js/components/channels/channel';

import * as appUtils from '../../../src/js/utils/app';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    user: {
        email: 'some@email.com'
    },
    appState: {
        widgetOpened: false,
        settingsVisible: false,
        embedded: false
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
    },
    smoochId: '1234',
    settings: {}
};


describe('Widget Component', () => {

    let component;
    let componentNode;
    let mockedStore;
    let props;
    let store;

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
        sandbox.stub(appUtils, 'hasChannels').returns(true);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        mockedStore && mockedStore.restore();
    });

    describe('is closed', () => {
        store = createMockedStore(sandbox, props);
        props = Object.assign({}, defaultProps);
        mockedStore = mockAppStore(sandbox, {
            conversation: {
                unreadCount: 0
            }
        });

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                         <WidgetComponent {...props} />
                                                     </Provider>);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should have a sk-close class', () => {
            componentNode.className.indexOf('sk-close').should.be.gt(-1);
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
            componentNode.className.indexOf('sk-appear').should.be.gt(-1);
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

    describe('error notification', () => {
        describe('shown', () => {
            const props = Object.assign({}, defaultProps, {
                appState: {
                    errorNotificationMessage: 'this is a notification message'
                }
            });

            beforeEach(() => {
                component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                             <WidgetComponent {...props} />
                                                         </Provider>);
            });

            it('should render the notification', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedErrorNotification').length.should.eq(1);
            });
        });
        describe('hidden', () => {
            const props = Object.assign({}, defaultProps, {
                appState: {
                    errorNotificationMessage: null
                }
            });

            beforeEach(() => {
                component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                             <WidgetComponent {...props} />
                                                         </Provider>);
            });

            it('should render the notification', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedErrorNotification').length.should.eq(0);
            });
        });
    });

    describe('channels', () => {
        const props = Object.assign({}, defaultProps);
        store = createMockedStore(sandbox, props);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<Provider store={ store }>
                                                         <WidgetComponent {...props} />
                                                     </Provider>);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render the channels view', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedChannel').length.should.eq(1);
        });

    });
});
