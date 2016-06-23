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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INTRO_BOTTOM_SPACER = 10;

var ConversationComponent = exports.ConversationComponent = function (_Component) {
    (0, _inherits3.default)(ConversationComponent, _Component);

    function ConversationComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, ConversationComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
            logoIsAnchored: true
        }, _this.scrollTimeouts = [], _this.onTouchStart = function () {
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
            }
        }, _this.scrollToBottom = function () {
            var timeout = setTimeout(function () {
                var container = (0, _reactDom.findDOMNode)(_this);
                var logo = _this.refs.logo;
                var scrollTop = container.scrollHeight - container.clientHeight - logo.clientHeight - INTRO_BOTTOM_SPACER;
                container.scrollTop = scrollTop;
            });
            _this.scrollTimeouts.push(timeout);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    ConversationComponent.prototype.componentDidMount = function componentDidMount() {
        this.scrollToBottom();
    };

    ConversationComponent.prototype.componentDidUpdate = function componentDidUpdate() {
        this.scrollToBottom();
    };

    ConversationComponent.prototype.componentWillUnmount = function componentWillUnmount() {
        this.scrollTimeouts.forEach(clearTimeout);
    };

    ConversationComponent.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props;
        var connectNotificationTimestamp = _props.connectNotificationTimestamp;
        var introHeight = _props.introHeight;
        var messages = _props.messages;
        var errorNotificationMessage = _props.errorNotificationMessage;
        var settings = this.context.settings;


        var messageItems = messages.map(function (message) {
            return _react2.default.createElement(_message.MessageComponent, (0, _extends3.default)({ key: message._clientId || message._id,
                accentColor: settings.accentColor,
                linkColor: settings.linkColor,
                onLoad: _this2.scrollToBottom
            }, message));
        });

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
            maxHeight: 'calc(100% - ' + (introHeight + INTRO_BOTTOM_SPACER) + 'px)'
        };

        return _react2.default.createElement(
            'div',
            { id: 'sk-conversation',
                className: errorNotificationMessage && 'notification-shown',
                ref: 'container',
                onTouchStart: this.onTouchStart },
            _react2.default.createElement(_introduction.Introduction, null),
            _react2.default.createElement(
                'div',
                { className: 'sk-messages-container',
                    style: messagesContainerStyle },
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

ConversationComponent.contextTypes = {
    settings: _react.PropTypes.object
};
ConversationComponent.propTypes = {
    connectNotificationTimestamp: _react.PropTypes.number,
    introHeight: _react.PropTypes.number.isRequired,
    messages: _react.PropTypes.array.isRequired,
    errorNotificationMessage: _react.PropTypes.string
};
var Conversation = exports.Conversation = (0, _reactRedux.connect)(function (_ref) {
    var appState = _ref.appState;
    var conversation = _ref.conversation;

    return {
        messages: conversation.messages,
        embedded: appState.embedded,
        introHeight: appState.introHeight,
        connectNotificationTimestamp: appState.connectNotificationTimestamp,
        errorNotificationMessage: appState.errorNotificationMessage
    };
})(ConversationComponent);