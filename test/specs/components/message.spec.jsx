import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { mockComponent } from '../../utils/react';

import { MessageComponent } from '../../../src/js/components/message';
import { ActionComponent } from '../../../src/js/components/action';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    role: 'appUser',
    text: 'This is a text!',
    actions: []
};

xdescribe('Message', () => {
    var component;

    beforeEach(() => {
        mockComponent(sandbox, ActionComponent, 'div', {
            className: 'mockedAction'
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('no actions', () => {
        const props = {
            role: 'appUser',
            text: 'This is a text!'
        };

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<MessageComponent {...props} />);
        });

        it('should not contain any actions', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-action').length.should.be.eq(0);
        });

        it('should contains the given text', () => {
            const message = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-msg');
            message.textContent.should.eq(props.text);
        });
    });

    describe('appUser', () => {
        const props = Object.assign({}, defaultProps);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<MessageComponent {...props} />);
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

        it('should contains the given text', () => {
            const message = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-msg');
            message.textContent.should.eq(props.text);
        });
    });

    ['appMaker', 'whisper'].forEach((role) => {
        describe(`${role} without actions`, () => {
            const props = Object.assign({}, defaultProps, {
                role: role,
                name: 'Smooch',
                avatarUrl: 'http://some-image.url'
            });
            const firstMessageProps = Object.assign({}, props, {
                        firstInGroup: true
            });
            const lastMessageProps = Object.assign({}, props, {
                        lastInGroup: true
                    });
            const firstMessageComponent = TestUtils.renderIntoDocument(<MessageComponent {...firstMessageProps} />);
            const lastMessageComponent = TestUtils.renderIntoDocument(<MessageComponent {...lastMessageProps} />);

            beforeEach(() => {
                component = TestUtils.renderIntoDocument(<MessageComponent {...props} />);

            });

            it('should be on the left', () => {
                const row = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-row');
                row.className.indexOf('sk-left-row').should.be.gte(0);
                row.className.indexOf('sk-right-row').should.be.eq(-1);
            });

            it('should not contain any actions', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedAction').length.should.be.eq(0);
            });

            it('should contains the given text', () => {
                const message = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-msg');
                message.textContent.should.eq(props.text);
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
                component = TestUtils.renderIntoDocument(<MessageComponent {...props} />);
            });

            it('should be on the left', () => {
                const row = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-row');
                row.className.indexOf('sk-left-row').should.be.gte(0);
                row.className.indexOf('sk-right-row').should.be.eq(-1);
            });

            it('should contain any actions', () => {
                const actionNodes = TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedAction');
                actionNodes.length.should.be.eq(props.actions.length);
            });

            it('should contains the given text', () => {
                const message = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-msg');
                // actions text will be added at the end.
                message.textContent.indexOf(props.text).should.eq(0);
            });
        });
    });

});
