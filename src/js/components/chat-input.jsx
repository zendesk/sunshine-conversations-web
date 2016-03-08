import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { sendMessage, resetUnreadCount } from 'services/conversation-service';
import { store } from 'stores/app-store';
import { preventPageScroll, allowPageScroll } from 'utils/dom';


export class ChatInputComponent extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            text: '',
            inputContainerWidth: undefined
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
        e.preventDefault();
        checkAndResetUnreadCount();
    }

    onSendMessage(e) {
        e.preventDefault();
        const text = this.state.text;
        const node = findDOMNode(this);
        if (text.trim()) {
            this.setState({
                text: ''
            });
            sendMessage(text);
        // this.refs.input.focus();
        }

    }

    onTouchStart(e) {
        console.log('touch start')
    }

    componentDidMount() {
        const node = findDOMNode(this);
        this.setState({
            inputContainerWidth: node.clientWidth - this.refs.buttonWrapper.clientWidth
        });
    }

    render() {
        const containerStyle = {
            width: this.state.inputContainerWidth
        };

        return (
            <div id='sk-footer'>
                <div className='sk-footer-content'>
                    <form onSubmit={ this.onSendMessage } action='#'>
                        <div className='input-container' style={containerStyle}>
                            <input ref='input'
                                   placeholder={ this.props.ui.text.inputPlaceholder }
                                   className='input message-input'
                                   onChange={ this.onChange }
                                   onFocus={ this.onFocus }
                                   value={ this.state.text }
                                   title={ this.props.ui.text.sendButtonText }></input>
                        </div>
                        <div className='send-wrapper' onTouchStart={ this.onSendMessage } ref='buttonWrapper'>
                            <a ref='button'
                               className='send'
                               onClick={ this.onSendMessage }>
                                { this.props.ui.text.sendButtonText }
                            </a>
                        </div>
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
