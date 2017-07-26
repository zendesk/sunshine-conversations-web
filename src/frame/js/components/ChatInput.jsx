import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { sendMessage, resetUnreadCount } from '../actions/conversation';

import ImageUpload from './ImageUpload';

import { bindAll } from '../utils/functions';


export class ChatInputComponent extends Component {

    static propTypes = {
        accentColor: PropTypes.string,
        imageUploadEnabled: PropTypes.bool.isRequired,
        inputPlaceholderText: PropTypes.string.isRequired,
        sendButtonText: PropTypes.string.isRequired,
        unreadCount: PropTypes.number.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    state = {
        text: ''
    };

    constructor(...args) {
        super(...args);
        bindAll(this,
            'blur',
            'checkAndResetUnreadCount',
            'onChange',
            'onFocus',
            'onSendMessage'
        );
    }

    blur() {
        this.refs.input.blur();
    }

    checkAndResetUnreadCount(unreadCount) {
        const {dispatch} = this.props;
        if (unreadCount > 0) {
            dispatch(resetUnreadCount());
        }
    }

    onChange(e) {
        this.checkAndResetUnreadCount(this.props.unreadCount);
        this.setState({
            text: e.target.value
        });
    }

    onFocus() {
        this.checkAndResetUnreadCount(this.props.unreadCount);
    }

    onSendMessage(e) {
        e.preventDefault();
        const {text} = this.state;
        const {dispatch} = this.props;
        if (text.trim()) {
            this.setState({
                text: ''
            });
            dispatch(sendMessage(text));
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

export default connect(({ui, conversation: {unreadCount}, config}) => {
    return {
        imageUploadEnabled: config.imageUploadEnabled,
        accentColor: config.style.accentColor,
        sendButtonText: ui.text.sendButtonText,
        inputPlaceholderText: ui.text.inputPlaceholder,
        unreadCount
    };
}, undefined, undefined, {
    withRef: true
})(ChatInputComponent);
