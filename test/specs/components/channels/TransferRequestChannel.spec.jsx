import sinon from 'sinon';
import TestUtils from 'react-dom/test-utils';

import TransferRequestChannelContent from '../../../../src/frame/js/components/channels/TransferRequestChannelContent';
import Loading from '../../../../src/frame/js/components/Loading';

import { wrapComponentWithStore } from '../../../utils/react';
import { createMockedStore, generateBaseStoreProps } from '../../../utils/redux';

const sandbox = sinon.sandbox.create();
const baseStoreProps = generateBaseStoreProps();
const url = 'http://foo/';

describe('TransferRequestChannelContent', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should render connect link', () => {
        const store = createMockedStore(sandbox, {
            ...baseStoreProps
        });
        const component = wrapComponentWithStore(TransferRequestChannelContent , {
            url,
            channelState: {
                transferRequestCode: 'foo'
            }
        }, store);

        const links = TestUtils.scryRenderedDOMComponentsWithTag(component, 'a');
        links.length.should.eq(1);
        links[0].href.should.eq(url);
    });

    it('should show loader without code', () => {
        const store = createMockedStore(sandbox, {
            ...baseStoreProps
        });
        const component = wrapComponentWithStore(TransferRequestChannelContent , {
            url,
            channelState: {
                transferRequestCode: ''
            }
        }, store);

        TestUtils.scryRenderedDOMComponentsWithTag(component, 'a').length.should.eql(0);
        TestUtils.findRenderedComponentWithType(component, Loading);
    });

    it('should render error retry link', () => {
        const store = createMockedStore(sandbox, {
            ...baseStoreProps
        });
        const component = wrapComponentWithStore(TransferRequestChannelContent , {
            url,
            channelState: {
                transferRequestCode: 'foo',
                hasError: true
            }
        }, store);

        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-error-link').length.should.eql(1);
    });
});
