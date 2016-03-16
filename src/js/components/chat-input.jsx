import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import isMobile from 'ismobilejs';
import debounce from 'lodash.debounce';

import { sendMessage, resetUnreadCount, uploadImage } from 'services/conversation-service';
import { store } from 'stores/app-store';

export class ChatInputComponent extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            text: '',
            inputContainerWidth: undefined
        };

        this.onChange = this.onChange.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this._debouncedResize = debounce(this.resizeInput.bind(this), 150);
    }

    blur() {
        this.refs.input.blur();
    }

    onChange(e) {
        checkAndResetUnreadCount();
        this.setState({
            text: e.target.value
        });
    }

    onFocus() {
        checkAndResetUnreadCount();
    }
    resizeInput() {
        const node = findDOMNode(this);
        let buttonsWidth = this.refs.button.offsetWidth;
        if (this.refs.imageUpload) {
            buttonsWidth += this.refs.imageUpload.offsetWidth;
        }

        this.setState({
            inputContainerWidth: node.offsetWidth - buttonsWidth
        });
    }

    onSendMessage(e) {
        e.preventDefault();
        const text = this.state.text;
        if (text.trim()) {
            this.setState({
                text: ''
            });
            sendMessage(text);
            this.refs.input.focus();
        }
    }

    onImageChange(e) {
        e.preventDefault();
        const files = this.refs.fileInput.files;
        Array.from(files).forEach(uploadImage);
    }

    componentDidMount() {
        this.resizeInput();
        window.addEventListener('resize', this._debouncedResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._debouncedResize);
    }

    render() {
        const containerStyle = {
            width: this.state.inputContainerWidth
        };

        let sendButton;

        const buttonClassNames = ['send'];

        if (this.state.text.trim()) {
            buttonClassNames.push('active');
        }

        if (isMobile.apple.device) {
            // Safari on iOS needs a way to send on click, without triggering a mouse event.
            // onTouchStart will do the trick and the input won't lose focus.
            sendButton = <span ref='button'
                               className={ buttonClassNames.join(' ') }
                               onTouchStart={ this.onSendMessage }>{ this.props.ui.text.sendButtonText }</span>;
        } else {
            sendButton = <a ref='button'
                            className={ buttonClassNames.join(' ') }
                            onClick={ this.onSendMessage }>
                             { this.props.ui.text.sendButtonText }
                         </a>;
        }

        const imageUploadButton = this.props.imageUploadEnabled ?
            <label className='btn btn-sk-link image-upload'
                   ref='imageUpload'>
                <input type='file'
                       accept='image/*'
                       onChange={ this.onImageChange }
                       ref='fileInput' />
                <i className='fa fa-picture-o'></i>
            </label> : null;

        const inputContainerClasses = ['input-container'];

        if (!this.props.imageUploadEnabled) {
            inputContainerClasses.push('no-upload');
        }

        return (
            <div id='sk-footer'>
                <form onSubmit={ this.onSendMessage }
                      action='#'>
                    { imageUploadButton }
                    <div className={ inputContainerClasses.join(' ') }
                         style={ containerStyle }>
                        <input ref='input'
                               placeholder={ this.props.ui.text.inputPlaceholder }
                               className='input message-input'
                               onChange={ this.onChange }
                               onFocus={ this.onFocus }
                               value={ this.state.text }
                               title={ this.props.ui.text.sendButtonText }></input>
                    </div>
                    { sendButton }
                </form>
            </div>
            );
    }
}

export const ChatInput = connect((state) => {
    return {
        ui: state.ui,
        imageUploadEnabled: state.appState.imageUploadEnabled
    };
}, undefined, undefined, {
    withRef: true
})(ChatInputComponent);

function checkAndResetUnreadCount() {
    if (store.getState().conversation.unreadCount > 0) {
        resetUnreadCount();
    }
}
