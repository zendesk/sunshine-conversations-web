import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import isMobile from 'ismobilejs';
import debounce from 'lodash.debounce';

import { sendMessage, resetUnreadCount } from 'services/conversation-service';
import { store } from 'stores/app-store';

import { ImageUpload } from 'components/image-upload';

export class ChatInputComponent extends Component {
    static defaultProps = {
        settings: {}
    };

    constructor(...args) {
        super(...args);

        this.state = {
            text: '',
            inputContainerWidth: undefined
        };

        this.onChange = this.onChange.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
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

    resizeInput(attempt = 0) {
        const node = findDOMNode(this);

        const nodeRect = node.getBoundingClientRect();
        const buttonRect = this.refs.button.getBoundingClientRect();

        // floor widget width and ceil button width to ensure button fits in widget
        const nodeWidth = Math.floor(nodeRect.width);
        let buttonsWidth = Math.ceil(buttonRect.width);

        if (this.refs.imageUpload) {
            const imageUploadRect = findDOMNode(this.refs.imageUpload).getBoundingClientRect();
            const imageUploadWith = Math.ceil(imageUploadRect.width);
            buttonsWidth += imageUploadWith;
        }

        if (node.offsetWidth - buttonsWidth > 0) {
            this.setState({
                inputContainerWidth: nodeWidth - buttonsWidth
            });
        } else {
            // let's try it 10 times (so, 1 sec)
            if (attempt < 10) {
                setTimeout(() => {
                    this.resizeInput(attempt + 1);
                }, 100);
            } else {
                // otherwise, let's hope 70% won't break it and won't look too silly
                this.setState({
                    inputContainerWidth: '70%'
                });
            }
        }
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

    componentDidMount() {
        setTimeout(() => this.resizeInput());
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
        const buttonStyle = {};

        if (this.state.text.trim()) {
            buttonClassNames.push('active');

            if (this.props.settings.accentColor) {
                buttonStyle.color = `#${this.props.settings.accentColor}`;
            }
        }

        if (isMobile.apple.device) {
            // Safari on iOS needs a way to send on click, without triggering a mouse event.
            // onTouchStart will do the trick and the input won't lose focus.
            sendButton = <span ref='button'
                               className={ buttonClassNames.join(' ') }
                               onTouchStart={ this.onSendMessage }
                               style={ buttonStyle }>{ this.props.ui.text.sendButtonText }</span>;
        } else {
            sendButton = <a ref='button'
                            className={ buttonClassNames.join(' ') }
                            onClick={ this.onSendMessage }
                            style={ buttonStyle }>
                             { this.props.ui.text.sendButtonText }
                         </a>;
        }

        const imageUploadButton = this.props.imageUploadEnabled ?
            <ImageUpload ref='imageUpload'
                         accentColor={ this.props.settings.accentColor } /> : null;

        const inputContainerClasses = ['input-container'];

        if (!this.props.imageUploadEnabled) {
            inputContainerClasses.push('no-upload');
        }

        return (
            <div id='sk-footer'>
                { imageUploadButton }
                <form onSubmit={ this.onSendMessage }
                      action='#'>
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
        settings: state.app.settings && state.app.settings.web,
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
