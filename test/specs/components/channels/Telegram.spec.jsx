import sinon from 'sinon';
import TestUtils from 'react-dom/test-utils';

import TelegramChannelContent from '../../../../src/frame/js/components/channels/TelegramChannelContent';

import { wrapComponentWithStore } from '../../../utils/react';
import { createMockedStore, generateBaseStoreProps } from '../../../utils/redux';

const sandbox = sinon.sandbox.create();

describe('Telegram Channel Component', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should render', () => {
        const store = createMockedStore(sandbox, generateBaseStoreProps({
            integrations: {
                telegram: {
                    hasError: false,
                    transferRequestCode: ''
                }
            }
        }));
        const component = wrapComponentWithStore(TelegramChannelContent, {
            username: 'foo',
            channelState: {
                transferRequestCode: 'foo'
            }
        }, store);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'a').length.should.eq(1);
    });
});
