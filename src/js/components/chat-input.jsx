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

    onChange(e) {
        this.setState({
            text: e.target.value
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
        }

        this.refs.input.focus();
    }

    onFocus(e) {
        if (store.getState().conversation.unreadCount > 0) {
            resetUnreadCount();
        }
    }

    render() {
        return (
            <div id='sk-footer'>
                <form onSubmit={ this.onSendMessage }>
                    <input ref='input'
                           placeholder={ this.props.ui.text.inputPlaceholder }
                           className='input message-input'
                           onChange={ this.onChange }
                           onFocus={ this.onFocus }
                           value={ this.state.text }></input>
                    <a ref='button'
                       href='#'
                       className='send'
                       onClick={ this.onSendMessage }>
                        { this.props.ui.text.sendButtonText }
                    </a>
                </form>
            </div>
            );
    }
}

export const ChatInput = connect((state) => {
    return {
        ui: state.ui
    };
})(ChatInputComponent);
