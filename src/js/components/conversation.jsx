import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { MessageComponent } from './message';
import { ConnectNotification } from './connect-notification';
import { logo, logo2x } from '../constants/assets';
import { Introduction } from './introduction';

export class ConversationComponent extends Component {
    static contextTypes = {
        settings: PropTypes.object
    };

    state = {
        logoIsAnchored: true
    };

    scrollTimeouts = [];

    onTouchStart = () => {
        // in embedded we need to let user scroll past the conversation
        if (!this.props.embedded) {
            const node = findDOMNode(this);
            const top = node.scrollTop;
            const totalScroll = node.scrollHeight;
            const currentScroll = top + node.offsetHeight;


            // this bit of code makes sure there's always something to scroll
            // in the conversation view so the page behind won't start scrolling
            // when hitting top or bottom.
            if (top === 0) {
                node.scrollTop = 1;
            } else if (currentScroll === totalScroll) {
                node.scrollTop = top - 1;
            }
        }

    };

    scrollToBottom = () => {
        const timeout = setTimeout(() => {
            const container = findDOMNode(this);
            const logo = this.refs.logo;
            const scrollTop = container.scrollHeight - container.clientHeight - logo.clientHeight;
            container.scrollTop = scrollTop;
        });
        this.scrollTimeouts.push(timeout);
    };

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
        const {connectNotificationTimestamp, introHeight, messages} = this.props;
        const {settings} = this.context;

        let messageItems = messages.map((message) => {
            return <MessageComponent key={ message._clientId || message._id }
                                     accentColor={ settings.accentColor }
                                     linkColor={ settings.linkColor }
                                     onLoad={ this.scrollToBottom }
                                     {...message} />;
        });

        if (connectNotificationTimestamp) {
            const notificationIndex = messages.findIndex((message) => message.received > connectNotificationTimestamp);
            if (notificationIndex > -1) {
                messageItems = [
                    ...messageItems.slice(0, notificationIndex),
                    <ConnectNotification key='connect-notification' />,
                    ...messageItems.slice(notificationIndex)
                ];
            } else {
                messageItems.push(<ConnectNotification key='connect-notification' />);
            }
        }


        const logoStyle = isMobile.apple.device ? {
            paddingBottom: 10
        } : undefined;

        const messagesContainerStyle = {
            maxHeight: `calc(100% - ${introHeight + 10}px)`
        };

        return <div id='sk-conversation'
                    ref='container'
                    onTouchStart={ this.onTouchStart }>
                   <Introduction/>
                   <div className='sk-messages-container'
                        style={ messagesContainerStyle }>
                       <div ref='messages'
                            className='sk-messages'>
                           { messageItems }
                       </div>
                       <div className='sk-logo'
                            ref='logo'
                            style={ logoStyle }>
                           <a href='https://smooch.io/live-web-chat/?utm_source=widget'
                              target='_blank'><span>Messaging by</span> <img className='sk-image'
                                                                                                                                       src={ logo }
                                                                                                                                       srcSet={ `${logo} 1x, ${logo2x} 2x` }
                                                                                                                                       alt='smooch.io' /></a>
                       </div>
                   </div>
               </div>;
    }
}

export const Conversation = connect((state) => {
    return {
        messages: state.conversation.messages,
        embedded: state.appState.embedded,
        introHeight: state.appState.introHeight,
        connectNotificationTimestamp: state.appState.connectNotificationTimestamp
    };
})(ConversationComponent);
