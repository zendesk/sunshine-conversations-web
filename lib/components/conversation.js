'use strict';

exports.__esModule = true;
exports.Conversation = exports.ConversationComponent = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _message = require('./message');

var _connectNotification = require('./connect-notification');

var _assets = require('../constants/assets');

var _introduction = require('./introduction');

var _replyActions = require('./reply-actions');

var _typingIndicator = require('./typing-indicator');

var _appStateActions = require('../actions/app-state-actions');

var _conversation = require('../services/conversation');

var _dom = require('../utils/dom');

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INTRO_BOTTOM_SPACER = 10;
var EXTRA_COMPONENT_BOTTOM_SPACER = 10;
var LOAD_MORE_LINK_HEIGHT = 47;

var ConversationComponent = exports.ConversationComponent = function (_Component) {
    (0, _inherits3.default)(ConversationComponent, _Component);

    function ConversationComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, ConversationComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.debounceOnScroll = (0, _lodash2.default)(function () {
            _this.onScroll();
        }, 200), _this.onTouchMove = function (e) {
            // in embedded we need to let user scroll past the conversation
            if (!_this.props.embedded) {
                var node = (0, _reactDom.findDOMNode)(_this);
                var top = node.scrollTop;
                var totalScroll = node.scrollHeight;
                var currentScroll = top + node.offsetHeight;

                // this bit of code makes sure there's always something to scroll
                // in the conversation view so the page behind won't start scrolling
                // when hitting top or bottom.
                if (top === 0) {
                    node.scrollTop = 1;
                } else if (currentScroll === totalScroll) {
                    node.scrollTop = top - 1;
                }

                var containerNode = (0, _reactDom.findDOMNode)(_this.refs.messagesContainer);
                var messagesNode = (0, _reactDom.findDOMNode)(_this.refs.messages);
                // On iOS devices, when the messages container is not scrollable,
                // selecting it will cause the background page to scroll.
                // In order to fix, prevent default scroll behavior.
                if (_ismobilejs2.default.apple.device && containerNode.offsetHeight > messagesNode.offsetHeight) {
                    e.preventDefault();
                }
            }
        }, _this.onScroll = function () {
            var _this$props = _this.props,
                dispatch = _this$props.dispatch,
                shouldScrollToBottom = _this$props.shouldScrollToBottom,
                hasMoreMessages = _this$props.hasMoreMessages,
                isFetchingMoreMessages = _this$props.isFetchingMoreMessages;

            // If top of Conversation component is reached, we need to fetch older messages

            var node = (0, _reactDom.findDOMNode)(_this);
            if (node.scrollTop === 0 && hasMoreMessages && !isFetchingMoreMessages) {
                _this.fetchHistory();
            } else if (shouldScrollToBottom) {
                // Once we've started scrolling, we don't want the default behavior to force the scroll to the bottom afterwards
                dispatch((0, _appStateActions.setShouldScrollToBottom)(false));
            }
        }, _this.fetchHistory = function () {
            var _this$props2 = _this.props,
                dispatch = _this$props2.dispatch,
                messages = _this$props2.messages;

            var node = (0, _reactDom.findDOMNode)(_this);

            // make sure the last message is one from the server, otherwise it doesn't need to scroll to previous first message
            if (messages.length > 0 && messages[messages.length - 1]._id) {
                _this._lastTopMessageId = messages[0]._id;
            }

            var top = (0, _dom.getTop)(_this._topMessageNode, node);
            _this._lastTopMessageNodePosition = top - node.scrollTop;
            dispatch((0, _appStateActions.setFetchingMoreMessages)(true));

            // Timeout is needed because we need to compute sizes of HTML elements and thus need to make sure everything has rendered
            setTimeout(function () {
                dispatch((0, _conversation.fetchMoreMessages)());
            }, 400);
        }, _this.scrollToBottom = function () {
            var _this$props3 = _this.props,
                shouldScrollToBottom = _this$props3.shouldScrollToBottom,
                replyActions = _this$props3.replyActions,
                typingIndicatorShown = _this$props3.typingIndicatorShown;

            if (!_this._isScrolling && (shouldScrollToBottom || _this._forceScrollToBottom)) {
                _this._isScrolling = true;
                var container = (0, _reactDom.findDOMNode)(_this);
                var _logo = _this.refs.logo;
                var scrollTop = container.scrollHeight - container.clientHeight - _logo.clientHeight - INTRO_BOTTOM_SPACER;

                if (replyActions.length > 0 || typingIndicatorShown) {
                    scrollTop = scrollTop + EXTRA_COMPONENT_BOTTOM_SPACER;
                }

                container.scrollTop = scrollTop;
                _this._forceScrollToBottom = false;
                _this._isScrolling = false;
            }
        }, _this.scrollToPreviousFirstMessage = function () {
            var node = _this._lastTopMessageNode;
            var container = (0, _reactDom.findDOMNode)(_this);
            // This will scroll to specified node if we've reached the oldest messages.
            // Otherwise, scroll to this._lastTopMessageNode
            if (!_this.props.hasMoreMessages) {
                container.scrollTop = (0, _dom.getTop)(node, container) - LOAD_MORE_LINK_HEIGHT;
            } else {
                if (_this._lastTopMessageNodePosition && !_this._isScrolling) {
                    _this._isScrolling = true;

                    // When fetching more messages, we want to make sure that after
                    // render, the messages stay in the same places
                    container.scrollTop = (0, _dom.getTop)(node, container) - _this._lastTopMessageNodePosition;
                    _this._isScrolling = false;
                }
            }
            _this._lastTopMessageNode = undefined;
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    ConversationComponent.prototype.componentWillUpdate = function componentWillUpdate(nextProps) {
        var _props = this.props,
            currentMessages = _props.messages,
            isFetchingMoreMessages = _props.isFetchingMoreMessages,
            currentTypingIndicatorShown = _props.typingIndicatorShown,
            currentReplyActions = _props.replyActions;
        var newMessages = nextProps.messages,
            newTypingIndicatorShown = nextProps.typingIndicatorShown,
            newReplyActions = nextProps.replyActions;


        if (!this._lastNode) {
            this._forceScrollToBottom = true;
            return;
        }

        // Check for new appMaker (and whisper) messages
        var isAppMakerMessage = newMessages.length - currentMessages.length === 1 ? newMessages.slice(-1)[0].role !== 'appUser' : false;

        if ((isAppMakerMessage || currentTypingIndicatorShown !== newTypingIndicatorShown) && !isFetchingMoreMessages) {
            var container = (0, _reactDom.findDOMNode)(this);
            var lastNodeBottom = (0, _dom.getBoundingRect)(this._lastNode).bottom;
            var containerBottom = (0, _dom.getBoundingRect)(container).bottom;

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
    };

    ConversationComponent.prototype.componentDidMount = function componentDidMount() {
        // On component render, force scroll to bottom, or else conversation will
        // find itself at a random spot
        this.scrollToBottom();
    };

    ConversationComponent.prototype.componentDidUpdate = function componentDidUpdate() {
        if (this.props.isFetchingMoreMessages) {
            this.scrollToPreviousFirstMessage();
        } else {
            this.scrollToBottom();
        }
    };

    ConversationComponent.prototype.render = function render() {
        var _this2 = this;

        var _props2 = this.props,
            connectNotificationTimestamp = _props2.connectNotificationTimestamp,
            introHeight = _props2.introHeight,
            messages = _props2.messages,
            replyActions = _props2.replyActions,
            errorNotificationMessage = _props2.errorNotificationMessage,
            isFetchingMoreMessages = _props2.isFetchingMoreMessages,
            hasMoreMessages = _props2.hasMoreMessages,
            text = _props2.text,
            settings = _props2.settings,
            typingIndicatorShown = _props2.typingIndicatorShown,
            typingIndicatorName = _props2.typingIndicatorName;
        var fetchingHistory = text.fetchingHistory,
            fetchHistory = text.fetchHistory;
        var accentColor = settings.accentColor,
            linkColor = settings.linkColor;


        var messageItems = messages.map(function (message, index) {
            var refCallback = function refCallback(c) {
                if (index === 0) {
                    _this2._topMessageNode = (0, _reactDom.findDOMNode)(c);
                }

                if (_this2._lastTopMessageId === message._id) {
                    _this2._lastTopMessageNode = (0, _reactDom.findDOMNode)(c);
                }

                if (index === messages.length - 1) {
                    _this2._lastNode = (0, _reactDom.findDOMNode)(c);
                    _this2._lastMessageId = message._id;
                }
            };

            var lastInGroup = message.lastInGroup;

            if (index === messages.length - 1 && message.role !== 'appUser' && typingIndicatorShown && message.name === typingIndicatorName) {
                lastInGroup = false;
            }

            return _react2.default.createElement(_message.MessageComponent, (0, _extends3.default)({ key: message._clientId || message._id,
                ref: refCallback,
                accentColor: accentColor,
                linkColor: linkColor,
                onLoad: _this2.scrollToBottom
            }, message, {
                lastInGroup: lastInGroup }));
        });

        if (typingIndicatorShown) {
            var refCallback = function refCallback(c) {
                _this2._lastNode = (0, _reactDom.findDOMNode)(c);
            };

            var firstInGroup = true;

            if (messages.length > 0) {
                var lastMessage = messages[messages.length - 1];
                if (lastMessage.role !== 'appUser' && lastMessage.name === typingIndicatorName) {
                    firstInGroup = false;
                }
            }

            messageItems.push(_react2.default.createElement(_typingIndicator.TypingIndicator, { ref: refCallback,
                firstInGroup: firstInGroup,
                key: 'typing-indicator' }));
        }

        if (replyActions.length > 0) {
            var choices = replyActions.map(function (_ref) {
                var text = _ref.text,
                    iconUrl = _ref.iconUrl,
                    type = _ref.type,
                    metadata = _ref.metadata,
                    payload = _ref.payload;

                return {
                    text: text,
                    iconUrl: iconUrl,
                    metadata: metadata,
                    payload: payload,
                    type: type
                };
            });
            var _refCallback = function _refCallback(c) {
                _this2._lastNode = (0, _reactDom.findDOMNode)(c);
            };
            messageItems.push(_react2.default.createElement(_replyActions.ReplyActions, { ref: _refCallback,
                choices: choices,
                key: 'reply-actions' }));
        }

        if (connectNotificationTimestamp) {
            var notificationIndex = messages.findIndex(function (message) {
                return message.received > connectNotificationTimestamp;
            });
            if (notificationIndex > -1) {
                messageItems = [].concat(messageItems.slice(0, notificationIndex), [_react2.default.createElement(_connectNotification.ConnectNotification, { key: 'connect-notification' })], messageItems.slice(notificationIndex));
            } else {
                messageItems.push(_react2.default.createElement(_connectNotification.ConnectNotification, { key: 'connect-notification' }));
            }
        }

        var logoStyle = _ismobilejs2.default.apple.device ? {
            paddingBottom: 10
        } : undefined;

        var messagesContainerStyle = {
            maxHeight: hasMoreMessages ? '100%' : 'calc(100% - ' + (introHeight + INTRO_BOTTOM_SPACER) + 'px)'
        };

        var retrieveHistory = void 0;
        if (hasMoreMessages) {
            if (isFetchingMoreMessages) {
                retrieveHistory = _react2.default.createElement(
                    'div',
                    { className: 'sk-fetch-history' },
                    fetchingHistory
                );
            } else {
                var onClick = function onClick(e) {
                    e.preventDefault();
                    _this2.fetchHistory();
                };

                retrieveHistory = _react2.default.createElement(
                    'div',
                    { className: 'sk-fetch-history' },
                    _react2.default.createElement(
                        'a',
                        { href: '#',
                            onClick: onClick },
                        fetchHistory
                    )
                );
            }
        }

        var introduction = hasMoreMessages ? null : _react2.default.createElement(_introduction.Introduction, null);

        return _react2.default.createElement(
            'div',
            { id: 'sk-conversation',
                className: errorNotificationMessage && 'notification-shown',
                ref: 'container',
                onTouchMove: this.onTouchMove,
                onScroll: _ismobilejs2.default.any ? this.onScroll : this.debounceOnScroll },
            introduction,
            _react2.default.createElement(
                'div',
                { ref: 'messagesContainer',
                    className: 'sk-messages-container',
                    style: messagesContainerStyle },
                retrieveHistory,
                _react2.default.createElement(
                    'div',
                    { ref: 'messages',
                        className: 'sk-messages' },
                    messageItems
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'sk-logo',
                        ref: 'logo',
                        style: logoStyle },
                    _react2.default.createElement(
                        'a',
                        { href: 'https://smooch.io/live-web-chat/?utm_source=widget',
                            target: '_blank' },
                        _react2.default.createElement(
                            'span',
                            null,
                            'Messaging by'
                        ),
                        ' ',
                        _react2.default.createElement('img', { className: 'sk-image',
                            src: _assets.logo,
                            srcSet: _assets.logo + ' 1x, ' + _assets.logo2x + ' 2x',
                            alt: 'smooch.io' })
                    )
                )
            )
        );
    };

    return ConversationComponent;
}(_react.Component);

ConversationComponent.propTypes = {
    messages: _react.PropTypes.array.isRequired,
    embedded: _react.PropTypes.bool.isRequired,
    shouldScrollToBottom: _react.PropTypes.bool.isRequired,
    isFetchingMoreMessages: _react.PropTypes.bool.isRequired,
    hasMoreMessages: _react.PropTypes.bool.isRequired,
    introHeight: _react.PropTypes.number,
    connectNotificationTimestamp: _react.PropTypes.number,
    errorNotificationMessage: _react.PropTypes.string,
    settings: _react.PropTypes.object.isRequired,
    text: _react.PropTypes.object.isRequired,
    typingIndicatorShown: _react.PropTypes.bool.isRequired,
    replyActions: _react.PropTypes.array.isRequired
};
var Conversation = exports.Conversation = (0, _reactRedux.connect)(function (_ref2) {
    var appState = _ref2.appState,
        conversation = _ref2.conversation,
        text = _ref2.ui.text,
        app = _ref2.app;

    return {
        messages: conversation.messages,
        replyActions: conversation.replyActions,
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
        },
        typingIndicatorShown: appState.typingIndicatorShown,
        typingIndicatorName: appState.typingIndicatorName
    };
})(ConversationComponent);