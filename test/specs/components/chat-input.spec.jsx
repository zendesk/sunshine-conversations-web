import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { scryRenderedDOMComponentsWithId, findRenderedDOMComponentsWithId } from 'test/utils/react';

import { ChatInputComponent } from 'components/chat-input.jsx';

const conversationService = require('services/conversation-service');

const sandbox = sinon.sandbox.create();

const props = {
    ui: {
        text: {
            inputPlaceholder: 'Placeholder',
            sendButtonText: 'Button'
        }
    }
};

describe('ChatInput', () => {
    var component;
    var componentNode;

    var onChangeSpy;
    var onSendMessageSpy;
    var setStateSpy;

    var serviceSendMessageStub;


    beforeEach(() => {
        onChangeSpy = sandbox.spy(ChatInputComponent.prototype, 'onChange');
        onSendMessageSpy = sandbox.spy(ChatInputComponent.prototype, 'onSendMessage');
        setStateSpy = sandbox.spy(ChatInputComponent.prototype, 'setState');

        serviceSendMessageStub = sandbox.stub(conversationService, 'sendMessage');

        component = TestUtils.renderIntoDocument(<ChatInputComponent {...props} />);
        componentNode = ReactDOM.findDOMNode(component);

    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should use the ui text', () => {
        component.refs.input.placeholder.should.eq(props.ui.text.inputPlaceholder);
        component.refs.button.textContent.should.eq(props.ui.text.sendButtonText);
    });

    describe('change input', () => {
        it('should call onChange when input triggers change', () => {
            TestUtils.Simulate.change(component.refs.input);
            onChangeSpy.should.have.been.calledOnce;
        });

        it('should change state when calling onChange', () => {
            component.state.text.should.eq('');

            component.onChange({
                target: {
                    value: 'some text'
                }
            });

            setStateSpy.should.have.been.calledWith({
                text: 'some text'
            });

            component.state.text.should.eq('some text');
        });
    });

    describe('press button', () => {

        it('should call sendMessage when clicking the button', () => {
            TestUtils.Simulate.click(component.refs.button);
            onSendMessageSpy.should.have.been.calledOnce;
        });

        it('should prevent default event behavior', () => {
            let event = {
                preventDefault: sandbox.stub()
            };
            component.onSendMessage(event);

            event.preventDefault.should.have.been.calledOnce;
        });

        for (let value of ['', '      ']) {
            it('should do nothing if the current state is blank', () => {
                component.state.text = value;
                component.onSendMessage({
                    preventDefault: sandbox.stub()
                });

                setStateSpy.should.not.have.been.called;
                serviceSendMessageStub.should.not.have.been.called;
            });
        }

        it('should reset state and call conversation service if state not blank', () => {
            component.state.text = 'this is a value!';
            component.onSendMessage({
                preventDefault: sandbox.stub()
            });

            setStateSpy.should.have.been.calledWith({
                text: ''
            });

            component.state.text.should.eq('');

            serviceSendMessageStub.should.have.been.calledWith('this is a value!');
        });
    });
});
