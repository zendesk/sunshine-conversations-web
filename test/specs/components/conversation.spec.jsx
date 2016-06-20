import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { mockComponent } from '../../utils/react';

import { ConversationComponent } from '../../../src/js/components/conversation';
import { MessageComponent } from '../../../src/js/components/message';

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


xdescribe('Conversation', () => {

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
