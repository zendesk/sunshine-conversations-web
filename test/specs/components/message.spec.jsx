import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { mockComponent } from 'test/utils/react';

import { MessageComponent } from 'components/message.jsx';
import { ActionComponent } from 'components/action.jsx';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    role: 'appUser',
    text: 'This is a text!',
    actions: []
};

describe('Message', () => {
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
            const fromNode = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-from');
            fromNode.textContent.should.be.eq('');
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

            beforeEach(() => {
                component = TestUtils.renderIntoDocument(<MessageComponent {...props} />);
            });

            it('should have an avatar', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-msg-avatar').length.should.be.eq(1);
            });

            it('should be on the left', () => {
                const row = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-row');
                row.className.indexOf('sk-left-row').should.be.gte(0);
                row.className.indexOf('sk-right-row').should.be.eq(-1);
            });

            it('should put an author name on the message', () => {
                const fromNode = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-from');
                fromNode.textContent.should.be.eq(props.name);
            });

            it('should not contain any actions', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedAction').length.should.be.eq(0);
            });

            it('should contains the given text', () => {
                const message = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-msg');
                message.textContent.should.eq(props.text);
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

            it('should have an avatar', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-msg-avatar').length.should.be.eq(1);
            });

            it('should be on the left', () => {
                const row = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-row');
                row.className.indexOf('sk-left-row').should.be.gte(0);
                row.className.indexOf('sk-right-row').should.be.eq(-1);
            });

            it('should put an author name on the message', () => {
                const fromNode = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-from');
                fromNode.textContent.should.be.eq(props.name);
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
