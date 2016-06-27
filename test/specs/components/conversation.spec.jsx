import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { mockComponent } from '../../utils/react';
import { mockAppStore } from '../../utils/redux';

import { ConversationComponent } from '../../../src/js/components/conversation';
import { MessageComponent } from '../../../src/js/components/message';
import { Introduction } from '../../../src/js/components/introduction';
import { ConnectNotification } from '../../../src/js/components/connect-notification';
import { ParentComponentWithContext } from '../../utils/parent-component';

const sandbox = sinon.sandbox.create();
const defaultProps = {
    messages: [
        {
            _id: 1,
            received: 1
        },
        {
            _id: 2,
            received: 2
        },
        {
            _id: 3,
            received: 3
        },
        {
            _id: 4,
            received: 4
        }
    ],
    introHeight: 100
};

const context = {
    settings: {}
};

describe('Conversation', () => {

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

    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        mockedStore && mockedStore.restore();
    });

    describe('render', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, {});
            component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                 store={ mockedStore }>
                                                         <ConversationComponent {...defaultProps} />
                                                     </ParentComponentWithContext>);
        });

        it('should generate all messages in the props', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedMessage').length.should.eq(defaultProps.messages.length);
        });

        it('should render introduction text', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedIntroduction').length.should.eq(1);
        });
    });

    describe('ConnectNotification component', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, {});
            const props = Object.assign(defaultProps, {
                connectNotificationTimestamp: 5
            });
            const parentComponent = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                             store={ mockedStore }
                                                                                             accessElement='true'>
                                                                     <ConversationComponent {...props} />
                                                                 </ParentComponentWithContext>);
            component = parentComponent.refs.childElement;
        });

        it('should render', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedConnectNotification').length.should.eq(1);
        });
    });
});
