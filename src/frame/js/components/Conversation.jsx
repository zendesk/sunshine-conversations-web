import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';
import debounce from 'lodash.debounce';

import Message from './Message';
import ConnectNotification from './ConnectNotification';
import Introduction from './Introduction';
import ReplyActions from './ReplyActions';
import TypingIndicator from './TypingIndicator';

import { setShouldScrollToBottom, setFetchingMoreMessages } from '../actions/app-state';
import { fetchMoreMessages } from '../actions/conversation';
import { getTop, getBoundingRect } from '../utils/dom';
import { WIDGET_STATE } from '../constants/app';
import { logo, logo2x } from '../constants/assets';

const INTRO_BOTTOM_SPACER = 10;
const EXTRA_COMPONENT_BOTTOM_SPACER = 10;
const LOAD_MORE_LINK_HEIGHT = 47;

export class ConversationComponent extends Component {

    static propTypes = {
        messages: PropTypes.array.isRequired,
        embedded: PropTypes.bool.isRequired,
        shouldScrollToBottom: PropTypes.bool.isRequired,
        isFetchingMoreMessages: PropTypes.bool.isRequired,
        hasMoreMessages: PropTypes.bool.isRequired,
        introHeight: PropTypes.number,
        connectNotificationTimestamp: PropTypes.number,
        errorNotificationMessage: PropTypes.string,
        config: PropTypes.object.isRequired,
        text: PropTypes.object.isRequired,
        typingIndicatorShown: PropTypes.bool.isRequired,
        replyActions: PropTypes.array.isRequired
    };

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
            dispatch(fetchMoreMessages());
        }, 400);
    };

    scrollToBottom = () => {
        const {shouldScrollToBottom, replyActions, typingIndicatorShown} = this.props;
        if (!this._isScrolling && (shouldScrollToBottom || this._forceScrollToBottom)) {
            this._isScrolling = true;
            const container = findDOMNode(this);
            const logo = this.refs.logo;
            let scrollTop = container.scrollHeight - container.clientHeight - logo.clientHeight - INTRO_BOTTOM_SPACER;

            if (replyActions.length > 0 || typingIndicatorShown) {
                scrollTop = scrollTop + EXTRA_COMPONENT_BOTTOM_SPACER;
            }

            container.scrollTop = scrollTop;
            this._forceScrollToBottom = false;
            this._isScrolling = false;
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
                this._isScrolling = false;
            }
        }
        this._lastTopMessageNode = undefined;

    };

    componentWillUpdate(nextProps) {
        const {messages: currentMessages, isFetchingMoreMessages, typingIndicatorShown: currentTypingIndicatorShown, replyActions: currentReplyActions} = this.props;
        const {messages: newMessages, typingIndicatorShown: newTypingIndicatorShown, replyActions: newReplyActions} = nextProps;

        if (!this._lastNode) {
            this._forceScrollToBottom = true;
            return;
        }

        // Check for new appMaker (and whisper) messages
        const isAppMakerMessage = newMessages.length - currentMessages.length === 1 ? newMessages.slice(-1)[0].role !== 'appUser' : false;

        if ((isAppMakerMessage || (currentTypingIndicatorShown !== newTypingIndicatorShown)) && !isFetchingMoreMessages) {
            const container = findDOMNode(this);
            const lastNodeBottom = getBoundingRect(this._lastNode).bottom;
            const containerBottom = getBoundingRect(container).bottom;

            // If appMaker message is 'in view', we should scroll to bottom.
            // Otherwise, don't scroll
            if (lastNodeBottom <= containerBottom) {
                this._forceScrollToBottom = true;
            } else {
                this._forceScrollToBottom = false;
            }
        }

        if (currentMessages.length === newMessages.length && newReplyActions.length > 0 && currentReplyActions !== newReplyActions) {
            this._forceScrollToBottom = true;
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

    render() {
        const {connectNotificationTimestamp, introHeight, messages, replyActions, errorNotificationMessage, isFetchingMoreMessages, hasMoreMessages, text, config, typingIndicatorShown, typingIndicatorName} = this.props;
        const {fetchingHistory, fetchHistory} = text;
        const {accentColor, linkColor} = config.style;

        let messageItems = messages.map((message, index) => {
            const refCallback = (c) => {
                if (index === 0) {
                    this._topMessageNode = findDOMNode(c);
                }

                if (this._lastTopMessageId === message._id) {
                    this._lastTopMessageNode = findDOMNode(c);
                }

                if (index === messages.length - 1) {
                    this._lastNode = findDOMNode(c);
                    this._lastMessageId = message._id;
                }
            };

            let lastInGroup = message.lastInGroup;

            if (index === messages.length - 1 && message.role !== 'appUser' && typingIndicatorShown && message.name === typingIndicatorName) {
                lastInGroup = false;
            }

            return <Message key={ message._clientId || message._id }
                            ref={ refCallback }
                            accentColor={ accentColor }
                            linkColor={ linkColor }
                            onLoad={ this.scrollToBottom }
                            {...message}
                            lastInGroup={ lastInGroup } />;
        });

        if (typingIndicatorShown) {
            const refCallback = (c) => {
                this._lastNode = findDOMNode(c);
            };

            let firstInGroup = true;

            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                if (lastMessage.role !== 'appUser' && lastMessage.name === typingIndicatorName) {
                    firstInGroup = false;
                }
            }

            messageItems.push(<TypingIndicator ref={ refCallback }
                                               firstInGroup={ firstInGroup }
                                               key='typing-indicator' />);
        }

        if (replyActions.length > 0) {
            const choices = replyActions.map(({text, iconUrl, type, metadata, payload}) => {
                return {
                    text,
                    iconUrl,
                    metadata,
                    payload,
                    type
                };
            });
            const refCallback = (c) => {
                this._lastNode = findDOMNode(c);
            };
            messageItems.push(<ReplyActions ref={ refCallback }
                                            choices={ choices }
                                            key='reply' />);
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

        const introduction = hasMoreMessages ? null : <Introduction/>;

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

export default connect(({appState, conversation, ui: {text}, config}) => {
    return {
        messages: conversation.messages,
        replyActions: conversation.replyActions,
        embedded: appState.widgetState === WIDGET_STATE.EMBEDDED,
        shouldScrollToBottom: appState.shouldScrollToBottom,
        isFetchingMoreMessages: appState.isFetchingMoreMessages,
        hasMoreMessages: conversation.hasMoreMessages,
        introHeight: appState.introHeight,
        connectNotificationTimestamp: appState.connectNotificationTimestamp,
        errorNotificationMessage: appState.errorNotificationMessage,
        config,
        text: {
            fetchingHistory: text.fetchingHistory,
            fetchHistory: text.fetchHistory
        },
        typingIndicatorShown: appState.typingIndicatorShown,
        typingIndicatorName: appState.typingIndicatorName
    };
})(ConversationComponent);
