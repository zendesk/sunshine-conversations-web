import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { sendMessage, resetUnreadCount } from '../services/conversation-service';
import { store } from '../stores/app-store';

import { ImageUpload } from './image-upload';

function checkAndResetUnreadCount() {
    if (store.getState().conversation.unreadCount > 0) {
        resetUnreadCount();
    }
}

export class ChatInputComponent extends Component {

    static propTypes = {
        accentColor: PropTypes.string,
        imageUploadEnabled: PropTypes.bool.isRequired,
        inputPlaceholderText: PropTypes.string.isRequired,
        sendButtonText: PropTypes.string.isRequired
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
        const {accentColor, imageUploadEnabled, inputPlaceholderText, sendButtonText} = this.props;

        let sendButton;

        const buttonClassNames = ['send'];
        const buttonStyle = {};

        if (this.state.text.trim()) {
            buttonClassNames.push('active');

            if (accentColor) {
                buttonStyle.color = `#${accentColor}`;
            }
        }

        if (isMobile.apple.device) {
            // Safari on iOS needs a way to send on click, without triggering a mouse event.
            // onTouchStart will do the trick and the input won't lose focus.
            sendButton = <span ref='button'
                               className={ buttonClassNames.join(' ') }
                               onTouchStart={ this.onSendMessage }
                               style={ buttonStyle }>{ sendButtonText }</span>;
        } else {
            sendButton = <a ref='button'
                            className={ buttonClassNames.join(' ') }
                            onClick={ this.onSendMessage }
                            style={ buttonStyle }>
                             { sendButtonText }
                         </a>;
        }

        const imageUploadButton = imageUploadEnabled ?
            <ImageUpload ref='imageUpload'
                         color={ accentColor } /> : null;

        const inputContainerClasses = ['input-container'];

        if (!imageUploadEnabled) {
            inputContainerClasses.push('no-upload');
        }

        return <div id='sk-footer'>
                   { imageUploadButton }
                   <form onSubmit={ this.onSendMessage }
                         action='#'>
                       <div className={ inputContainerClasses.join(' ') }>
                           <input ref='input'
                                  placeholder={ inputPlaceholderText }
                                  className='input message-input'
                                  onChange={ this.onChange }
                                  onFocus={ this.onFocus }
                                  value={ this.state.text }
                                  title={ sendButtonText }></input>
                       </div>
                   </form>
                   { sendButton }
               </div>;
    }
}

export const ChatInput = connect(({appState, app, ui}) => {
    return {
        imageUploadEnabled: appState.imageUploadEnabled,
        accentColor: app.settings.web.accentColor,
        sendButtonText: ui.text.sendButtonText,
        inputPlaceholderText: ui.text.inputPlaceholder
    };
}, undefined, undefined, {
    withRef: true
})(ChatInputComponent);
