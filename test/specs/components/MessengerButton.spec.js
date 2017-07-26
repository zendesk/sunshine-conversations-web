import sinon from 'sinon';
import TestUtils from 'react-dom/test-utils';

import MessengerButton from '../../../src/frame/js/components/MessengerButton';
import DefaultButtonIcon from '../../../src/frame/js/components/DefaultButtonIcon';

import { mockComponent, wrapComponentWithStore } from '../../utils/react';
import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';

const sandbox = sinon.sandbox.create();

function getStoreState(state = {}) {
    if (!state.config) {
        state.config = {};
    }

    return generateBaseStoreProps({
        config: {
            ...state.config,
            style: {
                isBrandColorDark: true,
                ...state.config.style
            }
        },
        conversation: {
            unreadCount: 0,
            ...state.conversation
        },
        browser: {
            currentLocation: {}
        }
    });
}

describe('Messenger Button Component', () => {
    let mockedStore;
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

        mockedStore = createMockedStore(sandbox, getStoreState());

        const component = wrapComponentWithStore(MessengerButton, props, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultButtonIcon').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(0);
    });

    it('should render image if url', () => {
        const props = {
            shown: true
        };

        mockedStore = createMockedStore(sandbox, getStoreState({
            config: {
                style: {
                    buttonIconUrl: 'http://some-url.com'
                }
            }
        }));

        const component = wrapComponentWithStore(MessengerButton, props, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultButtonIcon').length.should.eq(0);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(1);
    });

    it('should not render unread count if none', () => {
        mockedStore = createMockedStore(sandbox, getStoreState({
            conversation: {
                unreadCount: 0
            }
        }));

        const component = wrapComponentWithStore(MessengerButton, null, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'unread-badge').length.should.eq(0);
    });

    it('should render the correct unread count', () => {
        mockedStore = createMockedStore(sandbox, getStoreState({
            conversation: {
                unreadCount: 3
            }
        }));

        const component = wrapComponentWithStore(MessengerButton, null, mockedStore);
        const unreadBadge = TestUtils.findRenderedDOMComponentWithClass(component, 'unread-badge');
        unreadBadge.textContent.should.eq('3');
    });

});
