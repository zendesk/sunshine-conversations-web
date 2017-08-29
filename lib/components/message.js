'use strict';

exports.__esModule = true;
exports.MessageComponent = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _textMessage = require('./text-message');

var _imageMessage = require('./image-message');

var _action = require('./action');

var _reactDom = require('react-dom');

var _dom = require('../utils/dom');

var _conversation = require('../services/conversation');

var _message = require('../constants/message');

var _loading = require('./loading');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Message = function (_Component) {
    (0, _inherits3.default)(Message, _Component);

    function Message() {
        (0, _classCallCheck3.default)(this, Message);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    Message.prototype.componentDidMount = function componentDidMount() {
        if (this.props.actions.length === 0) {
            this._restyleBubble();
        }
    };

    Message.prototype._restyleBubble = function _restyleBubble() {
        var bubble = (0, _reactDom.findDOMNode)(this.refs.messageContent);
        if (bubble) {
            var messageElement = bubble.firstChild;
            var messageProperties = (0, _dom.getElementProperties)(messageElement);
            var bubbleProperties = (0, _dom.getElementProperties)(bubble);
            var multiLineCheck = parseInt(bubbleProperties.fontSize) * 2;
            if (messageProperties.height > multiLineCheck && messageProperties.width < bubbleProperties.width) {
                bubble.style.width = messageProperties.width + parseInt(bubbleProperties.paddingLeft) + parseInt(bubbleProperties.paddingRight) + 'px';
            }
        }
    };

    Message.prototype.onMessageClick = function onMessageClick() {
        var sendStatus = this.props.sendStatus;


        if (sendStatus === _message.SEND_STATUS.FAILED) {
            this.props.dispatch((0, _conversation.resendMessage)(this.props._clientId));
        }
    };

    Message.prototype.render = function render() {
        var _props = this.props,
            name = _props.name,
            role = _props.role,
            avatarUrl = _props.avatarUrl,
            text = _props.text,
            accentColor = _props.accentColor,
            firstInGroup = _props.firstInGroup,
            lastInGroup = _props.lastInGroup,
            linkColor = _props.linkColor,
            type = _props.type,
            mediaUrl = _props.mediaUrl,
            sendStatus = _props.sendStatus,
            clickToRetryText = _props.clickToRetryText,
            tapToRetryText = _props.tapToRetryText,
            locationSendingFailedText = _props.locationSendingFailedText;

        var actions = this.props.actions.filter(function (_ref) {
            var type = _ref.type;
            return !_message.GLOBAL_ACTION_TYPES.includes(type);
        });
        var hasText = text && text.trim() && text.trim() !== mediaUrl;
        var hasFile = type === 'file';
        var hasImage = type === 'image';
        var hasLocation = type === 'location';
        var isAppUser = role === 'appUser';
        var hasActions = actions.length > 0;

        var lastItem = void 0;

        if (hasActions) {
            lastItem = 'actions';
        } else if (hasText || hasFile) {
            lastItem = 'text';
        } else if (hasLocation) {
            lastItem = 'location';
        }

        var avatarClass = hasImage ? ['sk-msg-avatar', 'sk-msg-avatar-img'] : ['sk-msg-avatar'];
        var avatarPlaceHolder = isAppUser ? null : _react2.default.createElement('div', { className: 'sk-msg-avatar-placeholder' });
        var containerClasses = ['sk-msg'];

        if (hasImage || actions.length > 0) {
            containerClasses.push('sk-msg-image');
        }

        var actionList = actions.map(function (action) {
            return _react2.default.createElement(_action.Action, (0, _extends3.default)({ key: action._id,
                buttonColor: linkColor
            }, action));
        });

        var avatar = isAppUser ? null : _react2.default.createElement('img', { alt: name + '\'s avatar',
            className: avatarClass.join(' '),
            src: avatarUrl });

        var textClasses = ['sk-message-item', 'sk-message-text'];

        if (lastItem === 'text') {
            textClasses.push('sk-last-item');
        }

        var textPart = (hasText || hasFile) && _react2.default.createElement(_textMessage.TextMessage, (0, _extends3.default)({}, this.props, {
            className: textClasses.join(' ') }));
        var imagePart = hasImage && _react2.default.createElement(_imageMessage.ImageMessage, this.props);

        var style = {};

        if (!hasImage || hasActions || hasText) {
            if (isAppUser && accentColor) {
                style.backgroundColor = style.borderLeftColor = '#' + accentColor;
            }
        }

        var rowClass = ['sk-row'];

        if (isAppUser) {
            rowClass.push('sk-right-row');
        } else {
            rowClass.push('sk-left-row');
        }

        if (firstInGroup) {
            if (isAppUser) {
                rowClass.push('sk-row-appuser-first');
            } else {
                rowClass.push('sk-row-appmaker-first');
            }
        }

        if (lastInGroup) {
            if (isAppUser) {
                rowClass.push('sk-row-appuser-last');
            } else {
                rowClass.push('sk-row-appmaker-last');
            }
        }

        if (!firstInGroup && !lastInGroup) {
            if (isAppUser) {
                rowClass.push('sk-row-appuser-middle');
            } else {
                rowClass.push('sk-row-appmaker-middle');
            }
        }

        var fromName = _react2.default.createElement(
            'div',
            { className: 'sk-from' },
            isAppUser ? '' : name
        );

        var actionListClasses = ['sk-message-item'];

        if (lastItem === 'actions') {
            actionListClasses.push('sk-last-item');
        }

        if ([_message.SEND_STATUS.SENDING, _message.SEND_STATUS.FAILED].includes(sendStatus)) {
            containerClasses.push('sk-msg-unsent');
        }

        var clickToRetry = _react2.default.createElement(
            'div',
            { className: 'sk-retry' },
            _ismobilejs2.default.any ? tapToRetryText : clickToRetryText
        );

        var locationClasses = ['sk-message-item'];

        if (lastItem === 'location') {
            locationClasses.push('sk-last-item');
        }

        if (sendStatus === _message.SEND_STATUS.SENDING) {
            locationClasses.push('sk-message-location-loading');
        } else {
            locationClasses.push('sk-message-text');
        }

        var locationPart = void 0;

        if (type === 'location' && !textPart) {
            locationPart = sendStatus === _message.SEND_STATUS.FAILED ? _react2.default.createElement(_textMessage.TextMessage, { className: locationClasses.join(' '),
                text: locationSendingFailedText,
                role: role }) : _react2.default.createElement(
                'div',
                { className: locationClasses.join(' ') },
                _react2.default.createElement(_loading.LoadingComponent, { color: !isAppUser ? accentColor : null })
            );
        }

        return _react2.default.createElement(
            'div',
            { className: rowClass.join(' ') },
            !isAppUser && firstInGroup ? fromName : null,
            lastInGroup ? avatar : avatarPlaceHolder,
            _react2.default.createElement(
                'div',
                { className: 'sk-msg-wrapper' },
                _react2.default.createElement(
                    'div',
                    { className: containerClasses.join(' '),
                        style: style,
                        ref: 'messageContent',
                        onClick: this.onMessageClick.bind(this) },
                    imagePart ? imagePart : null,
                    textPart ? textPart : null,
                    locationPart ? locationPart : null,
                    hasActions ? _react2.default.createElement(
                        'div',
                        { className: actionListClasses.join(' ') },
                        actionList
                    ) : null
                ),
                sendStatus === _message.SEND_STATUS.FAILED ? clickToRetry : null
            ),
            _react2.default.createElement('div', { className: 'sk-clear' })
        );
    };

    return Message;
}(_react.Component);

Message.propTypes = {
    name: _react.PropTypes.string,
    actions: _react.PropTypes.array,
    type: _react.PropTypes.string.isRequired,
    role: _react.PropTypes.string.isRequired,
    mediaUrl: _react.PropTypes.string,
    text: _react.PropTypes.string,
    accentColor: _react.PropTypes.string,
    linkColor: _react.PropTypes.string,
    firstInGroup: _react.PropTypes.bool,
    lastInGroup: _react.PropTypes.bool,
    sendStatus: _react.PropTypes.string,
    tapToRetryText: _react.PropTypes.string.isRequired,
    clickToRetryText: _react.PropTypes.string.isRequired,
    locationSendingFailedText: _react.PropTypes.string.isRequired
};
Message.defaultProps = {
    actions: [],
    sendStatus: _message.SEND_STATUS.SENT
};
var MessageComponent = exports.MessageComponent = (0, _reactRedux.connect)(function (_ref2) {
    var text = _ref2.ui.text;

    return {
        clickToRetryText: text.clickToRetry,
        tapToRetryText: text.tapToRetry,
        locationSendingFailedText: text.locationSendingFailed
    };
})(Message);