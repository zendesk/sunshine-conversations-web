import sinon from 'sinon';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { ChannelItem, NotificationsSettingsComponent } from '../../../src/js/components/notifications-settings';
import { CHANNEL_DETAILS } from '../../../src/js/constants/channels';

import { mockAppStore } from '../../utils/redux';
import { mockComponent, getContext, wrapComponentWithContext } from '../../utils/react';

import * as appUtils from '../../../src/js/utils/app';

const sandbox = sinon.sandbox.create();

describe('Channel Item Component', () => {
    [true, false].forEach((linked) => {
        describe(`${linked ? '' : 'not'} linked`, () => {
            let component;
            let mockedStore;

            let context;

            const defaultProps = {
                id: 'id',
                name: 'name',
                icon: '/icon/',
                icon2x: '/icon2x/',
                hasURL: 'true',
                displayName: 'displayname'
            };

            beforeEach(() => {
                const props = Object.assign(defaultProps, {
                    linked: linked
                });
                mockedStore = mockAppStore(sandbox, {});
                context = getContext({
                    settings: {
                        linkColor: '#00000'
                    },
                    ui: {
                        text: {
                            notificationSettingsConnectedAs: 'connected as'
                        }
                    },
                    store: mockedStore
                });

                component = wrapComponentWithContext(ChannelItem, props, context);
            });

            afterEach(() => {
                sandbox.restore();
            });

            after(() => {
                mockedStore && mockedStore.restore();
            });

            it(`should ${linked ? '' : 'not'} render with linked class`, () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-item-linked').length.should.be.eq(linked ? 1 : 0);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'linked').length.should.be.eq(linked ? 1 : 0);
            });

            it(`should ${linked ? '' : 'not'} show connected as`, () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-item-connected-as').length.should.be.eq(linked ? 1 : 0);
            });

            it(`should ${linked ? '' : 'not'} show link`, () => {
                const linkElement = TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-item-right')[0];
                linkElement.textContent.should.be.eq(linked ? 'Open' : '');
            });
        });
    });
});

describe('Notifications Settings', () => {

    let component;
    let context;
    let mockedStore;
    let props;

    const defaultProps = {
        appChannels: [
            {
                _id: 1,
                type: 'telegram',
                username: 'chloebot'
            },
            {
                _id: 2,
                type: 'messenger',
                username: 'messengerchloe'
            }
        ]
    };

    beforeEach(() => {
        mockComponent(sandbox, ChannelItem, 'div', {
            className: 'mockedChannelItem'
        });

        sandbox.stub(appUtils, 'getAppChannelDetails');
        appUtils.getAppChannelDetails.returns([
            {
                channel: {
                    type: 'telegram'
                },
                details: CHANNEL_DETAILS.telegram
            },
            {
                channel: {
                    type: 'messenger'
                },
                details: CHANNEL_DETAILS.messenger
            }
        ]);

        mockedStore = mockAppStore(sandbox, {});

        context = getContext({
            ui: {
                text: {
                    notificationSettingsChannelsTitle: 'notif settings channels title',
                    notificationSettingsChannelsDescription: 'notif settings channels desc'
                }
            },
            store: mockedStore
        });

        props = Object.assign(defaultProps, {
            user: {
                _id: 1230912,
                clients: []
            }
        });

        component = wrapComponentWithContext(NotificationsSettingsComponent, props, context);
    });

    afterEach(() => {
        sandbox.restore();
        mockedStore.restore();
    });

    it('should render channel items', () => {
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedChannelItem').length.should.be.eq(2);
    });

    it('should set the header text', () => {
        const header = TestUtils.scryRenderedDOMComponentsWithClass(component, 'settings-header')[0];
        header.textContent.should.eq(context.ui.text.notificationSettingsChannelsTitle);
    });

    it('should set channel description text', () => {
        const description = TestUtils.scryRenderedDOMComponentsWithClass(component, 'settings-description')[0];
        description.textContent.should.eq(context.ui.text.notificationSettingsChannelsDescription);
    });

    describe('No user id', () => {
        beforeEach(() => {
            props = Object.assign(defaultProps, {
                user: {}
            });
            component = wrapComponentWithContext(NotificationsSettingsComponent, props, context);
        });

        it('should not render', () => {
            const componentNode = ReactDOM.findDOMNode(component);
            expect(componentNode).to.be.null;
        });
    });
});
