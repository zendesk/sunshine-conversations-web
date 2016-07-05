import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { CHANNEL_DETAILS } from '../../../../src/js/constants/channels';
import { ChannelComponent } from '../../../../src/js/components/channels/channel';
import { ChannelPage } from '../../../../src/js/components/channels/channel-page';

import { mockComponent, wrapComponentWithContext, getContext } from '../../../utils/react';

const sandbox = sinon.sandbox.create();

const baseProps = {
    appChannels: [],
    channelStates: {}
};

const context = getContext();

describe('Channel Component', () => {
    beforeEach(() => {
        mockComponent(sandbox, ChannelPage, 'div', {
            className: 'channel-page'
        });

        Object.keys(CHANNEL_DETAILS).forEach((key) => {
            const details = CHANNEL_DETAILS[key];
            if (details.Component) {
                mockComponent(sandbox, details.Component, 'div', {
                    className: key
                });
            }
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render nothing if no smoochId', () => {
        const props = {
            ...baseProps
        };

        const component = wrapComponentWithContext(ChannelComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(0);
    });

    it('should render container without children if no channels', () => {
        const props = {
            ...baseProps,
            smoochId: '12345'
        };

        const component = wrapComponentWithContext(ChannelComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(0);
    });

    it('should render page if channel is not linked and has component', () => {
        const props = {
            ...baseProps,
            appChannels: [
                {
                    type: 'messenger',
                    appId: '1234',
                    pageId: '1234'
                }
            ],
            smoochId: '12345',
            clients: [
                {
                    platform: 'web'
                }
            ]
        };

        const component = wrapComponentWithContext(ChannelComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'messenger').length.should.be.eq(1);
    });

    it('should not render page if channel is linked and has component', () => {
        const props = {
            ...baseProps,
            appChannels: [
                {
                    type: 'messenger',
                    appId: '1234',
                    pageId: '1234'
                }
            ],
            smoochId: '12345',
            clients: [
                {
                    platform: 'web'
                },
                {
                    platform: 'messenger'
                }
            ]
        };

        const component = wrapComponentWithContext(ChannelComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(0);
    });

    it('should not render page if channel is not linked and has no component', () => {
        const props = {
            ...baseProps,
            appChannels: [
                {
                    type: 'telegram'
                }
            ],
            smoochId: '12345',
            clients: [
                {
                    platform: 'web'
                }
            ]
        };

        const component = wrapComponentWithContext(ChannelComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(0);
    });

    it('should render page if channel is linked, has component, and is marked as render when linked', () => {
        const props = {
            ...baseProps,
            appChannels: [
                {
                    type: 'wechat'
                }
            ],
            channelStates: {
                wechat: {}
            },
            smoochId: '12345',
            clients: [
                {
                    platform: 'web'
                },
                {
                    platform: 'wechat'
                }
            ]
        };

        const component = wrapComponentWithContext(ChannelComponent, props, context);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'wechat').length.should.be.eq(1);
    });


});
