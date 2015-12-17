import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { scryRenderedDOMComponentsWithId, findRenderedDOMComponentsWithId } from 'test/utils/react';

import { Message } from 'components/conversation.jsx';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    role: 'appUser',
    text: 'This is a text!',
    actions: []
};

describe('ChatInput', () => {
    var component;
    var componentNode;

    afterEach(() => {
        sandbox.restore();
    });

    describe('appUser', () => {
        const props = Object.assign({}, defaultProps);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<Message {...props} />);
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

    });


    describe('appMaker', () => {
        const props = Object.assign({}, defaultProps, {
            role: 'appMaker',
            avatarUrl: 'http://some-image.url'
        });

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<Message {...props} />);
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
    });

});
