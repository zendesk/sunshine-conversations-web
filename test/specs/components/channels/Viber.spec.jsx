import sinon from 'sinon';
import isMobile from 'ismobilejs';
import TestUtils from 'react-dom/test-utils';

import ViberChannelContent from '../../../../src/frame/js/components/channels/ViberChannelContent';
import Loading from '../../../../src/frame/js/components/Loading';

import { wrapComponentWithStore } from '../../../utils/react';
import { createMockedStore } from '../../../utils/redux';

const sandbox = sinon.sandbox.create();

describe('Viber Channel Component', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should render qr code for desktop', () => {
        sandbox.stub(isMobile, 'any').value(false);
        const store = createMockedStore(sandbox);
        const component = wrapComponentWithStore(ViberChannelContent, {
            channelState: {
                qrCode: 'foo',
                transferRequestCode: 'bar'
            },
            uri: 'some-uri'
        }, store);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'a').length.should.eq(0);
    });

    it('should render connect link on mobile', () => {
        sandbox.stub(isMobile, 'any').value(true);
        const store = createMockedStore(sandbox);
        const component = wrapComponentWithStore(ViberChannelContent, {
            channelState: {
                qrCode: 'foo',
                transferRequestCode: 'bar'
            },
            uri: 'some-uri'
        }, store);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length.should.eq(0);
        TestUtils.scryRenderedDOMComponentsWithTag(component, 'a').length.should.eq(1);
    });

    it('should render error', () => {
        const store = createMockedStore(sandbox);
        const component = wrapComponentWithStore(ViberChannelContent, {
            channelState: {
                hasError: true
            },
            uri: 'some-uri'
        }, store);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'error-link').length.should.eql(1);
    });

    it('should render loading spinner', () => {
        const store = createMockedStore(sandbox);
        const component = wrapComponentWithStore(ViberChannelContent, {
            channelState: {},
            uri: 'some-uri'
        }, store);
        TestUtils.findRenderedComponentWithType(component, Loading);
    });
});
