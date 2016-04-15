import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { mockComponent } from 'test/utils/react';

import { ConversationComponent } from 'components/conversation.jsx';
import { MessageComponent } from 'components/message.jsx';

const sandbox = sinon.sandbox.create();
const props = {
    ui: {
        text: {
            introText: 'Intro text'
        }
    },
    conversation: {
        messages: [
            {
                _id: 1
            },
            {
                _id: 2
            },
            {
                _id: 3
            },
            {
                _id: 4
            }
        ]
    }
};


describe('Conversation', () => {

    var component;

    beforeEach(() => {
        // mock it, we don't care about the rendering of those, they are covered in separate tests
        mockComponent(sandbox, MessageComponent, 'div', {
            className: 'mockedMessage'
        });

        component = TestUtils.renderIntoDocument(<ConversationComponent {...props} />);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should use the ui text for the intro', () => {
        component.refs.intro.textContent.should.eq(props.ui.text.introText);
    });

    it('should generate all messages in the props', () => {
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedMessage').length.should.eq(props.conversation.messages.length);
    });

});
