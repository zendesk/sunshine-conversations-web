import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { MessageComponent } from './message';
import { ConnectNotification } from './connect-notification';
import { logo, logo2x } from '../constants/assets';
import { Introduction } from './introduction';
import { QuickReplies } from './quick-replies';

import { setShouldScrollToBottom, setFetchingMoreMessages } from '../actions/app-state-actions';
import { fetchMoreMessages } from '../services/conversation-service';
import { getTop } from '../utils/dom';
import debounce from 'lodash.debounce';

const INTRO_BOTTOM_SPACER = 10;
const LOAD_MORE_LINK_HEIGHT = 47;

export class ConversationComponent extends Component {

    static propTypes = {
        connectNotificationTimestamp: PropTypes.number,
        introHeight: PropTypes.number.isRequired,
        messages: PropTypes.array.isRequired,
        errorNotificationMessage: PropTypes.string
    };

    scrollTimeouts = [];

    debounceOnScroll = debounce(() => {
        this.onScroll();
    }, 200);

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
        const {dispatch, shouldScrollToBottom, hasMoreMessages, isFetchingMoreMessages} = this.props;

        // If top of Conversation component is reached, we need to fetch older messages
        const node = findDOMNode(this);
        if (node.scrollTop === 0 && hasMoreMessages && !isFetchingMoreMessages) {
            this.fetchHistory();
        } else if (shouldScrollToBottom) {
            // Once we've started scrolling, we don't want the default behavior to force the scroll to the bottom afterwards
            dispatch(setShouldScrollToBottom(false));
        }
    };

    fetchHistory = () => {
        const {dispatch, messages} = this.props;
        const node = findDOMNode(this);

        // make sure the last message is one from the server, otherwise it doesn't need to scroll to previous first message
        if (messages.length > 0 && messages[messages.length - 1]._id) {
            this._lastTopMessageId = messages[0]._id;
        }

        const top = getTop(this._topMessageNode, node);
        this._lastTopMessageNodePosition = top - node.scrollTop;
        dispatch(setFetchingMoreMessages(true));

        // Timeout is needed because we need to compute sizes of HTML elements and thus need to make sure everything has rendered
        setTimeout(() => {
            fetchMoreMessages();
        }, 400);
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
        const node = this._lastTopMessageNode;
        const container = findDOMNode(this);
        // This will scroll to specified node if we've reached the oldest messages.
        // Otherwise, scroll to this._lastTopMessageNode
        if (!this.props.hasMoreMessages) {
            container.scrollTop = getTop(node, container) - LOAD_MORE_LINK_HEIGHT;
        } else {
            if (this._lastTopMessageNodePosition && !this._isScrolling) {
                this._isScrolling = true;

                // When fetching more messages, we want to make sure that after
                // render, the messages stay in the same places
                container.scrollTop = getTop(node, container) - this._lastTopMessageNodePosition;

                const timeout = setTimeout(() => {
                    this._isScrolling = false;
                });

                this.scrollTimeouts.push(timeout);
            }
        }
        this._lastTopMessageNode = undefined;

    };

    componentWillUpdate(nextProps) {
        const {messages: currentMessages, isFetchingMoreMessages} = this.props;
        const {messages: newMessages} = nextProps;

        if (!this._lastMessageNode) {
            this._forceScrollToBottom = true;
            return;
        }

        // Check for new appMaker (and whisper) messages
        const isAppMakerMessage = newMessages.length - currentMessages.length === 1 ? newMessages.slice(-1)[0].role !== 'appUser' : false;
        if (isAppMakerMessage && !isFetchingMoreMessages) {
            const container = findDOMNode(this);
            const appMakerMessageBottom = this._lastMessageNode.getBoundingClientRect().bottom;
            const containerBottom = container.getBoundingClientRect().bottom;

            // If appMaker message is 'in view', we should scroll to bottom.
            // Otherwise, don't scroll
            if (appMakerMessageBottom <= containerBottom) {
                this._forceScrollToBottom = true;
            } else {
                this._forceScrollToBottom = false;
            }
        }
    }

    componentDidMount() {
        // On component render, force scroll to bottom, or else conversation will
        // find itself at a random spot
        this.scrollToBottom();
    }

    componentDidUpdate() {
        if (this.props.isFetchingMoreMessages) {
            this.scrollToPreviousFirstMessage();
        } else {
            this.scrollToBottom();
        }
    }

    componentWillUnmount() {
        this.scrollTimeouts.forEach(clearTimeout);
    }

    render() {
        const {connectNotificationTimestamp, introHeight, messages, errorNotificationMessage, isFetchingMoreMessages, hasMoreMessages, text, settings} = this.props;
        const {fetchingHistory, fetchHistory} = text;
        const {accentColor, linkColor} = settings;

        let messageItems = messages.map((message, index) => {
            const refCallback = (c) => {
                if (index === 0) {
                    this._topMessageNode = findDOMNode(c);
                }

                if (this._lastTopMessageId === message._id) {
                    this._lastTopMessageNode = findDOMNode(c);
                }

                if (index === messages.length - 1) {
                    this._lastMessageNode = findDOMNode(c);
                    this._lastMessageId = message._id;
                }
            };

            return <MessageComponent key={ message._clientId || message._id }
                                     ref={ refCallback }
                                     accentColor={ accentColor }
                                     linkColor={ linkColor }
                                     onLoad={ this.scrollToBottom }
                                     {...message} />;
        });

        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const replies = lastMessage.actions ? lastMessage.actions.filter((a) => a.type === 'reply') : [];

            if (replies.length > 0) {
                const choices = replies.map(({text, payload, iconUrl}) => {
                    return {
                        text,
                        payload,
                        iconUrl
                    };
                });
                messageItems.push(<QuickReplies choices={ choices }
                                                key='quick-replies' />);
            }
        }

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
            maxHeight: hasMoreMessages ? '100%' : `calc(100% - ${introHeight + INTRO_BOTTOM_SPACER}px)`
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

        const introduction = hasMoreMessages ? '' : <Introduction/>;

        return <div id='sk-conversation'
                    className={ errorNotificationMessage && 'notification-shown' }
                    ref='container'
                    onTouchMove={ this.onTouchMove }
                    onScroll={ isMobile.any ? this.onScroll : this.debounceOnScroll }>
                   { introduction }
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

export const Conversation = connect(({appState, conversation, ui: {text}, app}) => {
    return {
        messages: conversation.messages,
        embedded: appState.embedded,
        shouldScrollToBottom: appState.shouldScrollToBottom,
        isFetchingMoreMessages: appState.isFetchingMoreMessages,
        hasMoreMessages: conversation.hasMoreMessages,
        introHeight: appState.introHeight,
        connectNotificationTimestamp: appState.connectNotificationTimestamp,
        errorNotificationMessage: appState.errorNotificationMessage,
        settings: app.settings.web,
        text: {
            fetchingHistory: text.fetchingHistory,
            fetchHistory: text.fetchHistory
        }
    };
})(ConversationComponent);
