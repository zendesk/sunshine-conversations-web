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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _textMessage = require('./text-message');

var _imageMessage = require('./image-message');

var _action = require('./action');

var _reactDom = require('react-dom');

var _dom = require('../utils/dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessageComponent = exports.MessageComponent = function (_Component) {
    (0, _inherits3.default)(MessageComponent, _Component);

    function MessageComponent() {
        (0, _classCallCheck3.default)(this, MessageComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    MessageComponent.prototype.componentDidMount = function componentDidMount() {
        if (this.props.actions.length === 0) {
            this._restyleBubble();
        }
    };

    MessageComponent.prototype._restyleBubble = function _restyleBubble() {
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

    MessageComponent.prototype.render = function render() {
        var _this2 = this;

        var actions = this.props.actions.map(function (action) {
            return _react2.default.createElement(_action.ActionComponent, (0, _extends3.default)({ key: action._id,
                buttonColor: _this2.props.linkColor
            }, action));
        });

        var isAppUser = this.props.role === 'appUser';

        var avatarClass = this.props.mediaUrl ? ['sk-msg-avatar', 'sk-msg-avatar-img'] : ['sk-msg-avatar'];
        var avatar = isAppUser ? null : _react2.default.createElement('img', { className: avatarClass.join(' '),
            src: this.props.avatarUrl });
        var avatarPlaceHolder = isAppUser ? null : _react2.default.createElement('div', { className: 'sk-msg-avatar-placeholder' });

        var message = this.props.mediaUrl ? _react2.default.createElement(_imageMessage.ImageMessage, this.props) : _react2.default.createElement(_textMessage.TextMessage, this.props);

        var containerClass = [this.props.mediaUrl ? 'sk-msg-image' : 'sk-msg'];

        if (this.props.text.trim() && this.props.actions.length > 0) {
            containerClass.push('has-actions');
        }

        var style = {};

        if (!this.props.mediaUrl) {
            if (isAppUser && this.props.accentColor) {
                style.backgroundColor = style.borderLeftColor = '#' + this.props.accentColor;
            }
        }
        if (this.props.firstInGroup && !this.props.lastInGroup) {
            if (isAppUser) {
                containerClass.push('sk-msg-appuser-first');
            } else {
                containerClass.push('sk-msg-appmaker-first');
            }
        }
        if (this.props.lastInGroup && !this.props.firstInGroup) {
            if (isAppUser) {
                containerClass.push('sk-msg-appuser-last');
            } else {
                containerClass.push('sk-msg-appmaker-last');
            }
        }
        if (!this.props.firstInGroup && !this.props.lastInGroup) {
            if (isAppUser) {
                containerClass.push('sk-msg-appuser-middle');
            } else {
                containerClass.push('sk-msg-appmaker-middle');
            }
        }

        var fromName = _react2.default.createElement(
            'div',
            { className: 'sk-from' },
            isAppUser ? '' : this.props.name
        );

        return _react2.default.createElement(
            'div',
            { className: 'sk-row ' + (isAppUser ? 'sk-right-row' : 'sk-left-row') },
            !isAppUser && this.props.firstInGroup ? fromName : '',
            this.props.lastInGroup ? avatar : avatarPlaceHolder,
            _react2.default.createElement(
                'div',
                { className: 'sk-msg-wrapper' },
                _react2.default.createElement(
                    'div',
                    { className: containerClass.join(' '),
                        style: style,
                        ref: 'messageContent' },
                    message,
                    actions
                )
            ),
            _react2.default.createElement('div', { className: 'sk-clear' })
        );
    };

    return MessageComponent;
}(_react.Component);

MessageComponent.defaultProps = {
    actions: []
};