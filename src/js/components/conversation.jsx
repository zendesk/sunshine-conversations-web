import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { MessageComponent } from './message';
import { ConnectNotification } from './connect-notification';
import { logo, logo2x } from '../constants/assets';
import { Introduction } from './introduction';

import { setShouldScrollToBottom, setFetchingMoreMessages } from '../actions/app-state-actions';
import { fetchMoreMessages } from '../services/conversation-service';
import { getTop } from '../utils/dom';

const INTRO_BOTTOM_SPACER = 10;

export class ConversationComponent extends Component {
    static contextTypes = {
        settings: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired
    };

    static propTypes = {
        connectNotificationTimestamp: PropTypes.number,
        introHeight: PropTypes.number.isRequired,
        messages: PropTypes.array.isRequired,
        errorNotificationMessage: PropTypes.string
    };

    scrollTimeouts = [];

    onTouchMove = (e) => {
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

            const containerNode = findDOMNode(this.refs.messagesContainer);
            const messagesNode = findDOMNode(this.refs.messages);
            // On iOS devices, when the messages container is not scrollable,
            // selecting it will cause the background page to scroll.
            // In order to fix, prevent default scroll behavior.
            if (isMobile.apple.device && containerNode.offsetHeight > messagesNode.offsetHeight) {
                e.preventDefault();
            }
        }

    };

    onScroll = () => {
        // HINT: might want to consider debouncing or throttling this since it would be executed a lot on scroll
        const {dispatch, shouldScrollToBottom} = this.props;

        const node = findDOMNode(this);
        if(node.scrollTop === 0) {
            this.fetchHistory();
        } else if(shouldScrollToBottom) {
            // HINT : this will be triggered when an appMaker message is added, which is probably why it's not scrolling to bottom when receiving one
            dispatch(setShouldScrollToBottom(false));
        }

        // HINT: might want to check if scroll is at the bottom to reactivate auto scrolling
    };

    fetchHistory = () => {
        const {dispatch, hasMoreMessages, isFetchingMoreMessages, messages} = this.props;

        const node = findDOMNode(this);
        if(hasMoreMessages && !isFetchingMoreMessages) {
            // make sure the last message is one from the server, otherwise it doesn't need to scroll to previous first message
            if (messages.length > 0 && messages[messages.length - 1]._id) {
                this._lastTopMessageId = messages[0]._id;
            }
            
            const top = getTop(this._topMessageNode, node);
            this._lastTopMessageNodePosition = top - node.scrollTop;
            dispatch(setFetchingMoreMessages(true));
            setTimeout(() => {
                fetchMoreMessages();
            }, 400);
        }
    };

    scrollToBottom = () => {
        const {shouldScrollToBottom} = this.props;
        if(!this._isScrolling && (shouldScrollToBottom || this._forceScrollToBottom)) {
            this._isScrolling = true;
            const timeout = setTimeout(() => {
                const container = findDOMNode(this);
                const logo = this.refs.logo;
                const scrollTop = container.scrollHeight - container.clientHeight - logo.clientHeight - INTRO_BOTTOM_SPACER;
                container.scrollTop = scrollTop;
                this._isScrolling = false;
                this._forceScrollToBottom = false;
            });
            this.scrollTimeouts.push(timeout);
        }
    };

    scrollToPreviousFirstMessage = () => {
        if(this._lastTopMessageNodePosition && !this._isScrolling) {
            const container = findDOMNode(this);
            const node = this._lastTopMessageNode;

            this._isScrolling = true;

            const timeout = setTimeout(() => {
                container.scrollTop = getTop(node, container) - this._lastTopMessageNodePosition;
                this._isScrolling = false;
            });

            this.scrollTimeouts.push(timeout);
        }
    };

    componentWillUpdate(nextProps) {
        const {introHeight: currentIntroHeight} = this.props;
        const {introHeight: newIntroHeight} = nextProps;

        if (currentIntroHeight !== newIntroHeight) {
            this._forceScrollToBottom = true;
        }
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        if (this._lastTopMessageNode) {
            this.scrollToPreviousFirstMessage();
        } else {
            this.scrollToBottom();
        }
    }

    componentWillUnmount() {
        this.scrollTimeouts.forEach(clearTimeout);
        // TODO cleanup any this.flags assigned
    }

    render() {
        const {connectNotificationTimestamp, introHeight, messages, errorNotificationMessage, isFetchingMoreMessages, hasMoreMessages} = this.props;
        const {ui: {text: {fetchingHistory, fetchHistory}}, settings: {accentColor, linkColor}} = this.context;

        let messageItems = messages.map((message, index) => {
            const refCallback = (c) => {
                if (index === 0) {
                    this._topMessageNode = findDOMNode(c);
                }

                if (this._lastTopMessageId === message._id) {
                    this._lastTopMessageNode = findDOMNode(c);
                }
            };

            return <MessageComponent key={ message._clientId || message._id }
                                     ref={ refCallback }
                                     accentColor={ accentColor }
                                     linkColor={ linkColor }
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
            maxHeight: `calc(100% - ${introHeight + INTRO_BOTTOM_SPACER}px)`
        };

        let retrieveHistory;
        if (hasMoreMessages) {
            if (isFetchingMoreMessages) {
                retrieveHistory = <div className='sk-fetch-history'>
                                      { fetchingHistory }
                                  </div>;
            } else {
                const onClick = (e) => {
                    e.preventDefault();
                    this.fetchHistory();
                };

                retrieveHistory = <div className='sk-fetch-history'>
                                      <a href='#'
                                         onClick={ onClick }>
                                          { fetchHistory }
                                      </a>
                                  </div>;
            }
        }

        return <div id='sk-conversation'
                    className={ errorNotificationMessage && 'notification-shown' }
                    ref='container'
                    onTouchMove={ this.onTouchMove }
                    onScroll={ this.onScroll }>
                   <Introduction/>
                   <div ref='messagesContainer'
                        className='sk-messages-container'
                        style={ messagesContainerStyle }>
                       { retrieveHistory }
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

export const Conversation = connect(({appState, conversation}) => {
    return {
        messages: conversation.messages,
        embedded: appState.embedded,
        shouldScrollToBottom: appState.shouldScrollToBottom,
        isFetchingMoreMessages: appState.isFetchingMoreMessages,
        hasMoreMessages: conversation.hasMoreMessages,
        introHeight: appState.introHeight,
        connectNotificationTimestamp: appState.connectNotificationTimestamp,
        errorNotificationMessage: appState.errorNotificationMessage
    };
})(ConversationComponent);
