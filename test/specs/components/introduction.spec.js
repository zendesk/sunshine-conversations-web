import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';

import { Introduction } from '../../../src/js/components/introduction';
import { AlternateChannels } from '../../../src/js/components/alternate-channels';
import { DefaultAppIcon } from '../../../src/js/components/default-app-icon';

import { mockComponent, wrapComponentWithStore } from '../../utils/react';
import { createMockedStore } from '../../utils/redux';

const sandbox = sinon.sandbox.create();

function getStoreState(state = {}) {
    const defaultState = {
        app: {
            name: 'some-name',
            settings: {
                web: {
                    channels: {}
                }
            },
            integrations: []
        },
        ui: {
            text: {
                introductionText: 'introductionText',
                introAppText: 'introAppText'
            }
        },
        appState: {
            introHeight: 0
        },
        conversation: {
            unreadCount: 0
        }
    };

    return deepAssign(defaultState, state);
}

describe('Introduction Component', () => {
    let mockedStore;
    let props;

    beforeEach(() => {
        mockComponent(sandbox, AlternateChannels, 'div', {
            className: 'mockedAlternateChannels'
        });
        mockComponent(sandbox, DefaultAppIcon, 'div', {
            className: 'mockedDefaultAppIcon'
        });

        props = {
            dispatch: sandbox.spy()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render the app name', () => {
        mockedStore = createMockedStore(sandbox, getStoreState());
        const component = wrapComponentWithStore(Introduction, props, mockedStore);

        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'app-name');
        node.textContent.should.eq('some-name');
    });

    it('should use app icon if provided', () => {
        mockedStore = createMockedStore(sandbox, getStoreState({
            app: {
                iconUrl: 'http://some-site/some-path'
            }
        }));

        const component = wrapComponentWithStore(Introduction, props, mockedStore);

        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'app-icon');
        node.src.should.eq('http://some-site/some-path');
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultAppIcon').length.should.eq(0);
    });

    it('should use default app icon if no icon url is provided', () => {
        mockedStore = createMockedStore(sandbox, getStoreState());

        const component = wrapComponentWithStore(Introduction, props, mockedStore);

        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultAppIcon').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'app-icon').length.should.eq(0);
    });

    it('should use intro text only if app has no integrations', () => {
        const component = wrapComponentWithStore(Introduction, props, mockedStore);

        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'intro-text');
        node.textContent.should.eq('introductionText');
    });

    it('should use intro text and intro app text if app has integrations', () => {
        mockedStore = createMockedStore(sandbox, getStoreState({
            app: {
                integrations: [
                    {
                        type: 'messenger'
                    }
                ]
            }
        }));
        const component = wrapComponentWithStore(Introduction, props, mockedStore);

        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'intro-text');
        node.textContent.should.eq('introductionText introAppText');
    });

    it('should render the AlternateChannels component if app has integrations', () => {
        mockedStore = createMockedStore(sandbox, getStoreState({
            app: {
                integrations: [
                    {
                        type: 'messenger'
                    }
                ]
            }
        }));
        const component = wrapComponentWithStore(Introduction, props, mockedStore);

        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedAlternateChannels').length.should.eq(1);
    });

    it('should not render the AlternateChannels component if app has no integrations', () => {
        mockedStore = createMockedStore(sandbox, getStoreState());
        const component = wrapComponentWithStore(Introduction, props, mockedStore);

        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedAlternateChannels').length.should.eq(0);
    });

});
