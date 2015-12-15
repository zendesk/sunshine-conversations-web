import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { createMarkup, autolink } from '../utils/html';

export class Message extends Component {
    render() {
        const actions = this.props.actions.map((action) => {
            return (
                <div key={ action._id } className="sk-action">
                    <a className="btn btn-sk-primary" href={ action.uri } target="_blank">{action.text}</a>
                </div>
            );
        });

        const isAppUser = this.props.role === 'appUser';
        let avatar = isAppUser ? '' : (
            <img className="sk-msg-avatar" src={ this.props.avatarUrl } />
        );

        let text = this.props.text.split('\n').map((item, index) => {
            if(!item.trim()){
                return;
            }

            return (
                <span key={index}>
                    <span dangerouslySetInnerHTML={createMarkup(autolink(item, {target: '_blank'}))}></span>
                    <br/>
                </span>
            );
        });

        return (
            <div className={ 'sk-row ' + (isAppUser ? 'sk-right-row' : 'sk-left-row') }>
                { avatar }
                <div className="sk-msg-wrapper">
                    <div className="sk-from">{ isAppUser ?  '' : this.props.name }</div>
                    <div className="sk-msg">
                        { text }
                        { actions }
                    </div>
                </div>
                <div className="sk-clear"></div>
            </div>
        );
    }
}

export class ConversationComponent extends Component {
    _scrollToBottom() {
        let container = findDOMNode(this);
        let logo = this.refs.logo;
        let scrollTop = container.scrollHeight - container.clientHeight - logo.clientHeight;
        container.scrollTop = scrollTop;
    }

    componentDidMount() {
        setTimeout(this._scrollToBottom.bind(this));
    }

    componentDidUpdate() {
        setTimeout(this._scrollToBottom.bind(this));
    }

    render() {
        const messages = this.props.conversation.messages.map((message) => <Message key={message._id} {...message} />);

        return (
            <div id="sk-conversation" ref="container">
                <div className="sk-intro" dangerouslySetInnerHTML={createMarkup(this.props.ui.text.introText)}></div>
                    { messages }
                    <div className="sk-logo" ref="logo">
                        <a href="https://smooch.io/?utm_source=widget" target="_blank">
                            In-App Messaging by
                            <img className="sk-image" src="https://cdn.smooch.io/images/logo_webwidget.png" alt="SupportKit" />
                            <img className="sk-image-retina" src="https://cdn.smooch.io/images/logo_webwidget_2x.png" alt="SupportKit" />
                        </a>
                    </div>
            </div>
        );
    }
}

export const Conversation = connect((state) => {
    return {
        ui: state.ui,
        conversation: state.conversation
    };
})(ConversationComponent);
