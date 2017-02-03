import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { mockComponent } from '../../utils/react';

import { MessageComponent } from '../../../src/js/components/message';
import { Action } from '../../../src/js/components/action';
import { ImageMessage } from '../../../src/js/components/image-message';
import { TextMessage } from '../../../src/js/components/text-message';

import { wrapComponentWithStore } from '../../utils/react';
import { createMockedStore } from '../../utils/redux';
import { SEND_STATUS } from '../../../src/js/constants/message';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    role: 'appUser',
    text: 'This is a text!',
    type: 'text',
    actions: [],
    entity: {}
};

let mockedStore;

describe('Message Component', () => {
    let component;

    beforeEach(() => {
        mockComponent(sandbox, Action, 'div', {
            className: 'mockedAction'
        });
        mockComponent(sandbox, ImageMessage, 'div', {
            className: 'mockedImage'
        });
        mockComponent(sandbox, TextMessage, 'div', {
            className: 'mockedText'
        });

        mockedStore = createMockedStore(sandbox, {
            ui: {
                text: {
                    clickToRetry: 'click to retry',
                    tapToRetry: 'tap to retry',
                    locationSendingFailed: 'location sending failed'
                }
            },
            app: {
                settings: {
                    web: {}
                },
                integrations: {}
            },
            integrations: []
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    [true, false].forEach((isImage) => {
        describe(`no actions and ${isImage ? 'image' : 'text'} only`, () => {
            const props = {
                role: 'appUser',
                text: 'This is a text!',
                type: isImage ? 'image' : 'text',
                mediaUrl: isImage ? 'media-url' : undefined,
                entity: {}
            };

            beforeEach(() => {
                component = wrapComponentWithStore(MessageComponent, props, mockedStore);
            });

            it('should not contain any actions', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-action').length.should.be.eq(0);
            });

            it('should render a text message', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedText').length.should.be.eq(1);
            });

            it(`should ${isImage ? '' : 'not'} render an image message`, () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedImage').length.should.be.eq(isImage ? 1 : 0);
            });
        });
    });

    describe('appUser', () => {
        const props = Object.assign({
            type: 'text'
        }, defaultProps);

        beforeEach(() => {
            component = wrapComponentWithStore(MessageComponent, props, mockedStore);
        });

        it('should not have an avatar', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-msg-avatar').length.should.be.eq(0);
        });

        it('should be on the right', () => {
            const row = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-row');
            row.className.indexOf('sk-right-row').should.be.gte(0);
            row.className.indexOf('sk-left-row').should.be.eq(-1);
        });

        it('should not put an author name on the message', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-from').length.should.eq(0);
        });

        it('should not contain any actions', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-action').length.should.be.eq(0);
        });

        it('should render the text message', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedText').length.should.be.eq(1);
        });

        describe('with text sending in progress', () => {
            it('should render the text message with sk-msg-unsent', () => {
                const unsentProps = Object.assign(props, {
                    sendStatus: SEND_STATUS.SENDING
                });

                component = wrapComponentWithStore(MessageComponent, unsentProps, mockedStore);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-msg-unsent').length.should.be.eq(1);
            });
        });

        describe('with text sending failed', () => {
            it('should render the text message with sk-msg-unsent and a retry prompt', () => {
                const unsentProps = Object.assign(props, {
                    sendStatus: SEND_STATUS.FAILED
                });

                component = wrapComponentWithStore(MessageComponent, unsentProps, mockedStore);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-msg-unsent').length.should.be.eq(1);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-retry').length.should.be.eq(1);
            });
        });

        describe('location message', () => {
            const props = Object.assign({}, defaultProps, {
                role: 'appUser',
                name: 'Smooch appUser',
                avatarUrl: 'http://some-image.url',
                type: 'location'
            });

            beforeEach(() => {
                component = wrapComponentWithStore(MessageComponent, props, mockedStore);
            });

            describe('with location sending in progress', () => {
                it('should render a loading spinner sk-msg-unsent', () => {
                    const unsentProps = Object.assign(props, {
                        sendStatus: SEND_STATUS.SENDING,
                        text: null
                    });

                    component = wrapComponentWithStore(MessageComponent, unsentProps, mockedStore);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-msg-unsent').length.should.be.eq(1);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-message-location-loading').length.should.be.eq(1);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedText').length.should.eq(0);
                });
            });

            describe('with location sending failed', () => {
                it('should render the text message with sk-msg-unsent and a retry prompt', () => {
                    const unsentProps = Object.assign(props, {
                        sendStatus: SEND_STATUS.FAILED
                    });

                    component = wrapComponentWithStore(MessageComponent, unsentProps, mockedStore);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-msg-unsent').length.should.be.eq(1);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-retry').length.should.be.eq(1);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedText').length.should.eq(1);
                });
            });

            it('should render the text message', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedText').length.should.eq(1);
            });
        });
    });

    ['appMaker', 'whisper'].forEach((role) => {
        describe(`${role} without actions`, () => {
            const props = Object.assign({}, defaultProps, {
                role: role,
                name: 'Smooch',
                type: 'text',
                avatarUrl: 'http://some-image.url'
            });
            const firstMessageProps = Object.assign({}, props, {
                firstInGroup: true
            });
            const lastMessageProps = Object.assign({}, props, {
                lastInGroup: true
            });
            let firstMessageComponent;
            let lastMessageComponent;

            beforeEach(() => {
                firstMessageComponent = wrapComponentWithStore(MessageComponent, firstMessageProps, mockedStore);
                lastMessageComponent = wrapComponentWithStore(MessageComponent, lastMessageProps, mockedStore);
                component = wrapComponentWithStore(MessageComponent, props, mockedStore);
            });

            it('should be on the left', () => {
                const row = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-row');
                row.className.indexOf('sk-left-row').should.be.gte(0);
                row.className.indexOf('sk-right-row').should.be.eq(-1);
            });

            it('should not contain any actions', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedAction').length.should.be.eq(0);
            });

            it('should render the text message', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedText').length.should.be.eq(1);
            });

            describe('avatar', () => {
                it('should not display on first message', () => {
                    TestUtils.scryRenderedDOMComponentsWithClass(firstMessageComponent, 'sk-msg-avatar').length.should.eq(0);
                });

                it('should display on last message', () => {
                    TestUtils.scryRenderedDOMComponentsWithClass(lastMessageComponent, 'sk-msg-avatar').length.should.eq(1);
                });
            });


            describe('author name', () => {
                it('should display on first message', () => {
                    const fromNode = TestUtils.findRenderedDOMComponentWithClass(firstMessageComponent, 'sk-from');
                    fromNode.textContent.should.be.eq(props.name);
                });
                it('should not display on last message', () => {
                    TestUtils.scryRenderedDOMComponentsWithClass(lastMessageComponent, 'sk-from').length.should.eq(0);
                });
            });
        });

        describe(`${role} with actions`, () => {
            const props = Object.assign({}, defaultProps, {
                role: role,
                name: `Smooch ${role}`,
                avatarUrl: 'http://some-image.url',
                type: 'image',
                mediaUrl: 'media-url',
                actions: [
                    {
                        _id: '1',
                        text: 'Action 1',
                        uri: 'http://some-uri/'
                    },
                    {
                        _id: '2',
                        text: 'Action 2',
                        uri: 'wss://some-other-uri/'
                    }
                ]
            });

            beforeEach(() => {
                component = wrapComponentWithStore(MessageComponent, props, mockedStore);
            });

            it('should be on the left', () => {
                const row = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-row');
                row.className.indexOf('sk-left-row').should.be.gte(0);
                row.className.indexOf('sk-right-row').should.be.eq(-1);
            });

            it('should contain actions', () => {
                const actionNodes = TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedAction');
                actionNodes.length.should.be.eq(props.actions.length);
            });

            it('should render the text message', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedText').length.should.eq(1);
            });

            it('should render the image message', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedImage').length.should.be.eq(1);
            });
        });

        it('should not contain any reply or locationRequest actions', () => {
            const props = Object.assign({}, defaultProps, {
                role: role,
                name: `Smooch ${role}`,
                avatarUrl: 'http://some-image.url',
                actions: [
                    {
                        _id: '1',
                        text: 'GIMME PRIZZA',
                        type: 'reply',
                        payload: 'REPLY'
                    },
                    {
                        _id: '2',
                        text: 'Send my location',
                        type: 'locationRequest'
                    }
                ]
            });

            component = wrapComponentWithStore(MessageComponent, props, mockedStore);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-action').length.should.be.eq(0);
        });
    });

});
