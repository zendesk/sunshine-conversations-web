import sinon from 'sinon';
import isMobile from 'ismobilejs';
import TestUtils from 'react-addons-test-utils';

import { ViberChannelContent } from '../../../../src/js/components/channels/viber-channel-content';
import { LoadingComponent } from '../../../../src/js/components/loading';

import { wrapComponentWithStore } from '../../../utils/react';
import { createMockedStore, generateBaseStoreProps } from '../../../utils/redux';

const sandbox = sinon.sandbox.create();
const baseStoreProps = generateBaseStoreProps();
baseStoreProps.integrations.viber = {
    hasError: false,
    transferRequestCode: ''
};

describe('Viber Channel Component', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should render qr code for desktop', () => {
        sandbox.stub(isMobile, 'any', false);
        const store = createMockedStore(sandbox, {
            ...baseStoreProps
        });
        const component = wrapComponentWithStore(ViberChannelContent , {
            channelState: {
                qrCode: 'foo',
                transferRequestCode: 'bar'
            }
        }, store);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'a').length.should.eq(0);
    });

    it('should render connect link on mobile', () => {
        sandbox.stub(isMobile, 'any', true);
        const store = createMockedStore(sandbox, {
            ...baseStoreProps
        });
        const component = wrapComponentWithStore(ViberChannelContent , {
            channelState: {
                qrCode: 'foo',
                transferRequestCode: 'bar'
            }
        }, store);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(0);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'a').length.should.eq(1);
    });

    it('should render error', () => {
        const store = createMockedStore(sandbox, {
            ...baseStoreProps
        });
        const component = wrapComponentWithStore(ViberChannelContent , {
            channelState: {
                hasError: true
            }
        }, store);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-error-link').length.should.eql(1);
    });

    it('should render loading spinner', () => {
        const store = createMockedStore(sandbox, {
            ...baseStoreProps
        });
        const component = wrapComponentWithStore(ViberChannelContent , {
            channelState: {}
        }, store);
        TestUtils.findRenderedComponentWithType(component, LoadingComponent);
    });
});
