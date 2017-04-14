import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { MessengerChannelContent } from '../../../../src/js/components/channels/messenger-channel-content';

import { wrapComponentWithStore } from '../../../utils/react';
import { createMockedStore, generateBaseStoreProps } from '../../../utils/redux';

const sandbox = sinon.sandbox.create();
const baseStoreProps = generateBaseStoreProps();
baseStoreProps.integrations.messenger = {
    hasError: false,
    transferRequestCode: ''
};

describe('Messenger Channel Component', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should render', () => {
        const store = createMockedStore(sandbox, {
            ...baseStoreProps
        });
        const component = wrapComponentWithStore(MessengerChannelContent, {
            pageId: 'foo',
            channelState: {
                transferRequestCode: 'foo'
            }
        }, store);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'a').length.should.eq(1);
    });
});
