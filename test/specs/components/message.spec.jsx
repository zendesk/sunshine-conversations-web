import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { scryRenderedDOMComponentsWithId, findRenderedDOMComponentsWithId } from 'test/utils/react';

import { MessageComponent } from 'components/message.jsx';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    role: 'appUser',
    text: 'This is a text!',
    actions: []
};

describe('Message', () => {
    var component;
    var componentNode;

    afterEach(() => {
        sandbox.restore();
    });

    describe('appUser', () => {
        const props = Object.assign({}, defaultProps);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<MessageComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
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

    for (let role of ['appMaker', 'whisper']) {
        describe(`${role} without actions`, () => {
            const props = Object.assign({}, defaultProps, {
                role: role,
                name: 'Smooch',
                avatarUrl: 'http://some-image.url'
            });

            beforeEach(() => {
                component = TestUtils.renderIntoDocument(<MessageComponent {...props} />);
                componentNode = ReactDOM.findDOMNode(component);
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
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-action').length.should.be.eq(0);
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
                componentNode = ReactDOM.findDOMNode(component);
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
                const actionNodes = TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-action');
                actionNodes.length.should.be.eq(props.actions.length);

                actionNodes.forEach((node, index) => {
                    const link = node.getElementsByTagName('a')[0];
                    link.href.should.eq(props.actions[index].uri);
                    link.textContent.should.eq(props.actions[index].text);
                });
            });

            it('should contains the given text', () => {
                const message = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-msg');
                // actions text will be added at the end.
                message.textContent.indexOf(props.text).should.eq(0);
            });
        });
    }

});
