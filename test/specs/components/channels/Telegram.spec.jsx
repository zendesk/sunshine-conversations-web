import sinon from 'sinon';
import TestUtils from 'react-dom/test-utils';

import TelegramChannelContent from '../../../../src/frame/js/components/channels/TelegramChannelContent';

import { wrapComponentWithStore } from '../../../utils/react';
import { createMockedStore, generateBaseStoreProps } from '../../../utils/redux';

const sandbox = sinon.sandbox.create();
const baseStoreProps = generateBaseStoreProps();
baseStoreProps.integrations.telegram = {
    hasError: false,
    transferRequestCode: ''
};

describe('Telegram Channel Component', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should render', () => {
        const store = createMockedStore(sandbox, {
            ...baseStoreProps
        });
        const component = wrapComponentWithStore(TelegramChannelContent , {
            username: 'foo',
            channelState: {
                transferRequestCode: 'foo'
            }
        }, store);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'a').length.should.eq(1);
    });
});
