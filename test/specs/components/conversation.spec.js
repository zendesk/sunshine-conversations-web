import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { mockComponent, getContext, wrapComponentWithContext } from '../../utils/react';

import { mockAppStore } from '../../utils/redux';

import { ConversationComponent } from '../../../src/js/components/conversation';
import { MessageComponent } from '../../../src/js/components/message';
import { Introduction } from '../../../src/js/components/introduction';
import { ConnectNotification } from '../../../src/js/components/connect-notification';

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

describe('Conversation Component', () => {

    let component;
    let context;
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
        mockedStore = mockAppStore(sandbox, {});
        context = getContext({
            store: mockedStore
        });
    });

    afterEach(() => {
        sandbox.restore();
        mockedStore && mockedStore.restore();
    });

    describe('render', () => {
        beforeEach(() => {
            component = wrapComponentWithContext(ConversationComponent, defaultProps, context);
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
            const props = Object.assign(defaultProps, {
                connectNotificationTimestamp: 5
            });
            component = wrapComponentWithContext(ConversationComponent, props, context);
        });

        it('should render', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedConnectNotification').length.should.eq(1);
        });
    });
});
