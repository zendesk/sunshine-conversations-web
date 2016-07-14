import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { IntroductionComponent } from '../../../src/js/components/introduction';
import { AlternateChannels } from '../../../src/js/components/alternate-channels';
import { DefaultAppIcon } from '../../../src/js/components/default-app-icon';

import { mockComponent, wrapComponentWithContext, getContext } from '../../utils/react';

const sandbox = sinon.sandbox.create();

const baseContext = {
    ui: {
        text: {
            introductionText: 'introductionText',
            introAppText: 'introAppText'
        }
    }
};

describe('Introduction Component', () => {
    let props;
    beforeEach(() => {
        mockComponent(sandbox, AlternateChannels, 'div', {
            className: 'mockedAlternateChannels'
        });
        mockComponent(sandbox, DefaultAppIcon, 'div', {
            className: 'mockedDefaultAppIcon'
        });

        props = {
            appState: {
                introHeight: 0
            },
            dispatch: sandbox.spy()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render the app name', () => {
        const component = wrapComponentWithContext(IntroductionComponent, props, getContext({
            ...baseContext,
            app: {
                name: 'some-name',
                integrations: []
            }
        }));

        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'app-name');
        node.textContent.should.eq('some-name');
    });

    it('should use app icon if provided', () => {
        const component = wrapComponentWithContext(IntroductionComponent, props, getContext({
            ...baseContext,
            app: {
                iconUrl: 'http://some-site/some-path',
                integrations: []
            }
        }));

        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'app-icon');
        node.src.should.eq('http://some-site/some-path');
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultAppIcon').length.should.eq(0);
    });

    it('should use default app icon if no icon url is provided', () => {
        const component = wrapComponentWithContext(IntroductionComponent, props, getContext({
            ...baseContext,
            app: {
                integrations: []
            }
        }));

        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultAppIcon').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'app-icon').length.should.eq(0);
    });

    it('should use intro text only if app has no integrations', () => {
        const component = wrapComponentWithContext(IntroductionComponent, props, getContext({
            ...baseContext,
            app: {
                integrations: []
            }
        }));

        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'intro-text');
        node.textContent.should.eq('introductionText');
    });

    it('should use intro text and intro app text if app has integrations', () => {
        const component = wrapComponentWithContext(IntroductionComponent, props, getContext({
            ...baseContext,
            app: {
                integrations: [
                    {
                        type: 'messenger'
                    }
                ]
            }
        }));

        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'intro-text');
        node.textContent.should.eq('introductionText introAppText');
    });

    it('should render the AlternateChannels component if app has integrations', () => {
        const component = wrapComponentWithContext(IntroductionComponent, props, getContext({
            ...baseContext,
            app: {
                integrations: [
                    {
                        type: 'messenger'
                    }
                ]
            }
        }));

        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedAlternateChannels').length.should.eq(1);
    });

    it('should not render the AlternateChannels component if app has no integrations', () => {
        const component = wrapComponentWithContext(IntroductionComponent, props, getContext({
            ...baseContext,
            app: {
                integrations: []
            }
        }));

        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedAlternateChannels').length.should.eq(0);
    });

});
