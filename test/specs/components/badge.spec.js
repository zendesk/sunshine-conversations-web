import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { BadgeComponent, DefaultBadgeIcon } from '../../../src/js/components/badge';

import { mockComponent, wrapComponentWithContext } from '../../utils/react';

const sandbox = sinon.sandbox.create();

describe('Badge Component', () => {

    beforeEach(() => {
        mockComponent(sandbox, DefaultBadgeIcon, 'div', {
            className: 'mockedDefaultBadgeIcon'
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

        const component = wrapComponentWithContext(BadgeComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultBadgeIcon').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(0);
    });

    it('should render image if url', () => {
        const props = {
            shown: true
        };

        const context = {
            settings: {
                badgeIconUrl: 'http://some-url.com'
            }
        };

        const component = wrapComponentWithContext(BadgeComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedDefaultBadgeIcon').length.should.eq(0);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(1);
    });

});
