import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';

import { MessengerButton, DefaultButtonIcon } from '../../../src/js/components/messenger-button';

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
            }
        },
        conversation: {
            unreadCount: 0
        }
    };

    return deepAssign(defaultState, state);
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

        mockedStore = mockAppStore(sandbox, getStoreState());

        const component = wrapComponentWithStore(MessengerButton, props, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultButtonIcon').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(0);
    });

    it('should render image if url', () => {
        const props = {
            shown: true
        };

        mockedStore = mockAppStore(sandbox, getStoreState({
            app: {
                settings: {
                    web: {
                        buttonIconUrl: 'http://some-url.com'
                    }
                }
            }
        }));

        const component = wrapComponentWithStore(MessengerButton, props, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultButtonIcon').length.should.eq(0);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(1);
    });

    it('should not render unread count if none', () => {
        mockedStore = mockAppStore(sandbox, getStoreState({
            conversation: {
                unreadCount: 0
            }
        }));

        const component = wrapComponentWithStore(MessengerButton, null, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'unread-badge').length.should.eq(0);
    });

    it('should render the correct unread count', () => {
        mockedStore = mockAppStore(sandbox, getStoreState({
            conversation: {
                unreadCount: 3
            }
        }));

        const component = wrapComponentWithStore(MessengerButton, null, mockedStore);
        const unreadBadge = TestUtils.findRenderedDOMComponentWithClass(component, 'unread-badge');
        unreadBadge.textContent.should.eq('3');
    });

});
