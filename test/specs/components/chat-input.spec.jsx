import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { mockAppStore } from 'test/utils/redux';
import { mockComponent } from 'test/utils/react';

import { ChatInputComponent } from 'components/chat-input.jsx';
import { ImageUpload } from 'components/image-upload.jsx';

const conversationService = require('services/conversation-service');

const sandbox = sinon.sandbox.create();

const props = {
    imageUploadEnabled: true,
    ui: {
        text: {
            inputPlaceholder: 'Placeholder',
            sendButtonText: 'Button'
        }
    }
};

describe('ChatInput', () => {
    var component;
    var mockedStore;

    var onChangeSpy;
    var onSendMessageSpy;
    var setStateSpy;

    var resetUnreadCountStub;
    var serviceSendMessageStub;

    beforeEach(() => {

        mockComponent(sandbox, ImageUpload, 'div', {
            className: 'image-upload'
        });

        onChangeSpy = sandbox.spy(ChatInputComponent.prototype, 'onChange');
        onSendMessageSpy = sandbox.spy(ChatInputComponent.prototype, 'onSendMessage');

        sandbox.stub(conversationService, 'uploadImage').resolves();
        resetUnreadCountStub = sandbox.stub(conversationService, 'resetUnreadCount');
        serviceSendMessageStub = sandbox.stub(conversationService, 'sendMessage');

        component = TestUtils.renderIntoDocument(<ChatInputComponent {...props} />);

        // spy on it after rendering to avoid triggering it when the component mounts
        setStateSpy = sandbox.spy(ChatInputComponent.prototype, 'setState');
    });

    afterEach(() => {
        mockedStore && mockedStore.restore();
        sandbox.restore();
    });

    it('should use the ui text', () => {
        component.refs.input.placeholder.should.eq(props.ui.text.inputPlaceholder);
        component.refs.button.textContent.should.eq(props.ui.text.sendButtonText);
    });

    describe('focus input', () => {
        it('should reset unread count if > 0', () => {
            mockedStore = mockAppStore(sandbox, {
                conversation: {
                    unreadCount: 1
                }
            });

            component.onFocus();

            resetUnreadCountStub.should.have.been.calledOnce;
        });

        it('should not reset unread count if == 0', () => {
            mockedStore = mockAppStore(sandbox, {
                conversation: {
                    unreadCount: 0
                }
            });

            component.onFocus();

            resetUnreadCountStub.should.not.have.been.called;
        });
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
        it('should reset unread count if > 0', () => {
            mockedStore = mockAppStore(sandbox, {
                conversation: {
                    unreadCount: 1
                }
            });
            TestUtils.Simulate.change(component.refs.input);

            resetUnreadCountStub.should.have.been.calledOnce;
        });

        it('should not reset unread count if == 0', () => {
            mockedStore = mockAppStore(sandbox, {
                conversation: {
                    unreadCount: 0
                }
            });
            TestUtils.Simulate.change(component.refs.input);

            resetUnreadCountStub.should.not.have.been.called;
        });
    });

    describe('press button', () => {

        it('should call sendMessage when clicking the button', () => {
            TestUtils.Simulate.click(component.refs.button);
            onSendMessageSpy.should.have.been.calledOnce;
        });

        it('should prevent default event behavior', () => {
            const event = {
                preventDefault: sandbox.stub()
            };
            component.onSendMessage(event);

            event.preventDefault.should.have.been.calledOnce;
        });

        ['', '      '].forEach((value) => {
            it('should do nothing if the current state is blank', () => {
                component.state.text = value;
                component.onSendMessage({
                    preventDefault: sandbox.stub()
                });

                setStateSpy.should.not.have.been.called;
                serviceSendMessageStub.should.not.have.been.called;
            });
        });

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

    describe('Image upload button', () => {
        [true, false].forEach((imageUploadEnabled) => {
            let component;
            const componentProps = Object.assign({}, props, {
                imageUploadEnabled
            });

            beforeEach(() => {
                component = TestUtils.renderIntoDocument(<ChatInputComponent {...componentProps} />);
            });

            it(`should${imageUploadEnabled ? '' : 'not'} display the image upload button`, () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'image-upload').length.should.be.eq(imageUploadEnabled ? 1 : 0);
            });
        });
    });
});
