import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { MessengerButtonComponent, DefaultButtonIcon } from '../../../src/js/components/messenger-button';

import { mockComponent, wrapComponentWithContext } from '../../utils/react';

const sandbox = sinon.sandbox.create();

describe('Messenger Button Component', () => {

    beforeEach(() => {
        mockComponent(sandbox, DefaultButtonIcon, 'div', {
            className: 'mockedDefaultButtonIcon'
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render default icon if no url', () => {
        const props = {
            shown: true
        };

        const context = {
            settings: {}
        };

        const component = wrapComponentWithContext(MessengerButtonComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultButtonIcon').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(0);
    });

    it('should render image if url', () => {
        const props = {
            shown: true
        };

        const context = {
            settings: {
                buttonIconUrl: 'http://some-url.com'
            }
        };

        const component = wrapComponentWithContext(MessengerButtonComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultButtonIcon').length.should.eq(0);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(1);
    });

    it('should not render unread count if none', () => {
        const props = {
            unreadCount: 0
        };

        const context = {
            settings: {}
        };

        const component = wrapComponentWithContext(MessengerButtonComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'unread-badge').length.should.eq(0);
    });

    it('should render the correct unread count', () => {
        const props = {
            unreadCount: 3
        };

        const context = {
            settings: {}
        };

        const component = wrapComponentWithContext(MessengerButtonComponent, props, context);
        const unreadBadge = TestUtils.findRenderedDOMComponentWithClass(component, 'unread-badge');
        unreadBadge.textContent.should.eq('3');
    });

});
