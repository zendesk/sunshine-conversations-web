import sinon from 'sinon';
import TestUtils from 'react-dom/test-utils';

import MessengerChannelContent from '../../../../src/frame/js/components/channels/MessengerChannelContent';

import { wrapComponentWithStore } from '../../../utils/react';
import { createMockedStore } from '../../../utils/redux';

const sandbox = sinon.sandbox.create();

describe('Messenger Channel Component', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should render', () => {
        const store = createMockedStore(sandbox);
        const component = wrapComponentWithStore(MessengerChannelContent, {
            pageId: 'foo',
            channelState: {
                transferRequestCode: 'foo'
            }
        }, store);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'a').length.should.eq(1);
    });
});
