import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { sendMessage, resetUnreadCount } from '../services/conversation-service';
import { store } from '../stores/app-store';

import { ImageUpload } from './image-upload';

export class ChatInputComponent extends Component {
    static contextTypes = {
        settings: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired
    };

    constructor(...args) {
        super(...args);

        this.state = {
            text: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
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

    render() {
        const {settings, ui} = this.context;

        let sendButton;

        const buttonClassNames = ['send'];
        const buttonStyle = {};

        if (this.state.text.trim()) {
            buttonClassNames.push('active');

            if (settings.accentColor) {
                buttonStyle.color = `#${settings.accentColor}`;
            }
        }

        if (isMobile.apple.device) {
            // Safari on iOS needs a way to send on click, without triggering a mouse event.
            // onTouchStart will do the trick and the input won't lose focus.
            sendButton = <span ref='button'
                               className={ buttonClassNames.join(' ') }
                               onTouchStart={ this.onSendMessage }
                               style={ buttonStyle }>{ ui.text.sendButtonText }</span>;
        } else {
            sendButton = <a ref='button'
                            className={ buttonClassNames.join(' ') }
                            onClick={ this.onSendMessage }
                            style={ buttonStyle }>
                             { ui.text.sendButtonText }
                         </a>;
        }

        const imageUploadButton = this.props.imageUploadEnabled ?
            <ImageUpload ref='imageUpload'
                         accentColor={ settings.accentColor } /> : null;

        const inputContainerClasses = ['input-container'];

        if (!this.props.imageUploadEnabled) {
            inputContainerClasses.push('no-upload');
        }

        return (
            <div id='sk-footer'>
                { imageUploadButton }
                <form onSubmit={ this.onSendMessage }
                      action='#'>
                    <div className={ inputContainerClasses.join(' ') }>
                        <input ref='input'
                               placeholder={ ui.text.inputPlaceholder }
                               className='input message-input'
                               onChange={ this.onChange }
                               onFocus={ this.onFocus }
                               value={ this.state.text }
                               title={ ui.text.sendButtonText }></input>
                    </div>
                </form>
                { sendButton }
            </div>
            );
    }
}

export const ChatInput = connect((state) => {
    return {
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
