import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage, resetUnreadCount } from 'services/conversation-service';
import { store } from 'stores/app-store';


export class ChatInputComponent extends Component {
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

    onFocus(e) {
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
        }

        this.refs.input.focus();
    }

    render() {
        return (
            <div id='sk-footer'>
                <div className='sk-footer-content'>
                    <form onSubmit={ this.onSendMessage } action='#'>
                        <div className='input-container'>
                            <input ref='input'
                                   placeholder={ this.props.ui.text.inputPlaceholder }
                                   className='input message-input'
                                   onChange={ this.onChange }
                                   onFocus={ this.onFocus }
                                   value={ this.state.text }
                                   title={ this.props.ui.text.sendButtonText }></input>
                        </div>
                        <button ref='button'
                                type='submit'
                                className='btn-link send'
                                onClick={ this.onSendMessage }>
                            { this.props.ui.text.sendButtonText }
                        </button>
                    </form>
                </div>
            </div>
            );
    }
}

export const ChatInput = connect((state) => {
    return {
        ui: state.ui
    };
}, undefined, undefined, {
    withRef: true
})(ChatInputComponent);

function checkAndResetUnreadCount() {
    if (store.getState().conversation.unreadCount > 0) {
        resetUnreadCount();
    }
}
