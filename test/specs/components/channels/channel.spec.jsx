import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { ChannelPage } from '../../../../src/js/components/channels/channel-page';
import { Channel } from '../../../../src/js/components/channels/channel';
import { CHANNEL_DETAILS } from '../../../../src/js/constants/channels';
import * as appUtils from '../../../../src/js/utils/app';

import { mockComponent, wrapComponentWithStore } from '../../../utils/react';
import { createMockedStore } from '../../../utils/redux';

const sandbox = sinon.sandbox.create();

const baseStoreProps = {
    ui: {
        text: {}
    },
    app: {
        integrations: []
    },
    integrations: {},
    user: {
        _id: '1234'
    },
    appState: {
        visibleChannelType: null
    }
};

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

        sandbox.stub(appUtils, 'getAppChannelDetails');
        appUtils.getAppChannelDetails.returns([]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render nothing if no smoochId', () => {
        const store = createMockedStore(sandbox, {
            ...baseStoreProps,
            user: {}
        });
        const component = wrapComponentWithStore(Channel, null, store);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(0);
    });

    it('should render container without children if no channels', () => {
        const store = createMockedStore(sandbox, baseStoreProps);
        const component = wrapComponentWithStore(Channel, null, store);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(0);
    });

    it('should render page if channel is not linked and has component', () => {
        const storeProps = {
            ...baseStoreProps,
            app: {
                integrations: [
                    {
                        type: 'frontendEmail',
                        linkColor: '#ddd',
                        fromAddress: 'some@email.com'
                    }
                ]
            },
            appState: {
                visibleChannelType: 'frontendEmail'
            },
            user: {
                _id: '12345',
                clients: [
                    {
                        platform: 'web'
                    }
                ],
                pendingClients: []
            }
        };
        const store = createMockedStore(sandbox, storeProps);

        appUtils.getAppChannelDetails.returns([
            {
                channel: {
                    type: 'frontendEmail',
                    linkColor: '#ddd',
                    fromAddress: 'some@email.com'
                },
                details: CHANNEL_DETAILS.frontendEmail
            }
        ]);

        const component = wrapComponentWithStore(Channel, null, store);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'frontendEmail').length.should.be.eq(1);
    });

    it('should not render page if channel is linked and has component', () => {
        const storeProps = {
            ...baseStoreProps,
            app: {
                integrations: [
                    {
                        type: 'frontendEmail',
                        linkColor: '#ddd',
                        fromAddress: 'some@email.com'
                    }
                ]
            },
            appState: {
                visibleChannelType: 'frontendEmail'
            },
            user: {
                _id: '12345',
                clients: [
                    {
                        platform: 'web'
                    },
                    {
                        platform: 'frontendEmail'
                    }
                ],
                pendingClients: []
            }
        };

        const store = createMockedStore(sandbox, storeProps);

        appUtils.getAppChannelDetails.returns([
            {
                channel: {
                    type: 'frontendEmail',
                    linkColor: '#ddd',
                    fromAddress: 'some@email.com'
                },
                details: CHANNEL_DETAILS.frontendEmail
            }
        ]);

        const component = wrapComponentWithStore(Channel, null, store);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(0);
    });

    it('should not render page if channel is not linked and has no component', () => {
        const storeProps = {
            ...baseStoreProps,
            app: {
                integrations: [
                    {
                        type: 'telegram'
                    }
                ]
            },
            appState: {
                visibleChannelType: 'telegram'
            },
            user: {
                _id: '12345',
                clients: [
                    {
                        platform: 'web'
                    }
                ],
                pendingClients: []
            }
        };

        const store = createMockedStore(sandbox, storeProps);

        appUtils.getAppChannelDetails.returns([
            {
                channel: {
                    type: 'telegram'
                },
                details: CHANNEL_DETAILS.telegram
            }
        ]);

        const component = wrapComponentWithStore(Channel, null, store);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(0);
    });

    it('should render page if channel is linked, has component, and is marked as render when linked', () => {
        const storeProps = {
            ...baseStoreProps,
            app: {
                integrations: [
                    {
                        type: 'wechat'
                    }
                ]
            },
            integrations: {
                wechat: {}
            },
            appState: {
                visibleChannelType: 'wechat'
            },
            user: {
                _id: '12345',
                clients: [
                    {
                        platform: 'web'
                    },
                    {
                        platform: 'wechat'
                    }
                ],
                pendingClients: []
            }
        };

        const store = createMockedStore(sandbox, storeProps);

        appUtils.getAppChannelDetails.returns([
            {
                channel: {
                    type: 'wechat'
                },
                details: CHANNEL_DETAILS.wechat
            }
        ]);

        const component = wrapComponentWithStore(Channel, null, store);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-pages-container').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-page').length.should.be.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'wechat').length.should.be.eq(1);
    });


});
