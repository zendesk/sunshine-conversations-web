import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { createMarkup } from 'utils/html';
import { MessageComponent } from 'components/message.jsx';

export class ConversationComponent extends Component {
    state = {
        logoIsAnchored: true
    };

    scrollTimeouts = [];

    onTouchStart = () => {
        const node = findDOMNode(this);
        const top = node.scrollTop;
        const totalScroll = node.scrollHeight;
        const currentScroll = top + node.offsetHeight;

        if (top === 0) {
            node.scrollTop = 1;
        } else if (currentScroll === totalScroll) {
            node.scrollTop = top - 1;
        }
    };

    scrollToBottom() {
        let timeout = setTimeout(() => {
            let container = findDOMNode(this);
            let logo = this.refs.logo;
            let scrollTop = container.scrollHeight - container.clientHeight - logo.clientHeight;
            container.scrollTop = scrollTop;
        });
        this.scrollTimeouts.push(timeout);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        this.scrollTimeouts.forEach(clearTimeout);
    }

    render() {
        const messages = this.props.conversation.messages.map((message) => <MessageComponent key={ message._id } {...message} />);

        const logoStyle = isMobile.apple.device ? {
            paddingBottom: 10
        } : undefined;

        return (
            <div id='sk-conversation'
                 ref='container'
                 onTouchStart={ this.onTouchStart }>
                <div ref='intro'
                     className='sk-intro'
                     dangerouslySetInnerHTML={ createMarkup(this.props.ui.text.introText) }></div>
                <div className='sk-messages-container'>
                    <div ref='messages' className='sk-messages'>
                        { messages }
                    </div>
                    <div className='sk-logo' ref='logo' style={logoStyle}>
                        <a href='https://smooch.io/?utm_source=widget' target='_blank'><span>In-App Messaging by</span> <img className='sk-image'
                                                                                                                             src={ require('images/logo_webwidget.png') }
                                                                                                                             srcSet={ `${require('images/logo_webwidget.png')} 1x, ${require('images/logo_webwidget_2x.png')} 2x` }
                                                                                                                             alt='Smooch' /></a>
                    </div>
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
