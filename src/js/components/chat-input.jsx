import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import isMobile from 'ismobilejs';
import debounce from 'lodash.debounce';

import { sendMessage, resetUnreadCount } from 'services/conversation-service';
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
        this.setState({
            inputContainerWidth: node.offsetWidth - this.refs.button.offsetWidth
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

        return (
            <div id='sk-footer'>
                <form onSubmit={ this.onSendMessage }
                      action='#'>
                    <div className='input-container'
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
        settings: state.app.settings.web
    };
}, undefined, undefined, {
    withRef: true
})(ChatInputComponent);

function checkAndResetUnreadCount() {
    if (store.getState().conversation.unreadCount > 0) {
        resetUnreadCount();
    }
}
