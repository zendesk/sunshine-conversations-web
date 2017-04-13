'use strict';

exports.__esModule = true;
exports.ChatInput = exports.ChatInputComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _lodash = require('lodash.bindall');

var _lodash2 = _interopRequireDefault(_lodash);

var _conversation = require('../services/conversation');

var _imageUpload = require('./image-upload');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChatInputComponent = exports.ChatInputComponent = function (_Component) {
    (0, _inherits3.default)(ChatInputComponent, _Component);

    function ChatInputComponent() {
        (0, _classCallCheck3.default)(this, ChatInputComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        _this.state = {
            text: ''
        };

        (0, _lodash2.default)(_this, 'blur', 'checkAndResetUnreadCount', 'onChange', 'onFocus', 'onSendMessage');
        return _this;
    }

    ChatInputComponent.prototype.blur = function blur() {
        this.refs.input.blur();
    };

    ChatInputComponent.prototype.checkAndResetUnreadCount = function checkAndResetUnreadCount(unreadCount) {
        var dispatch = this.props.dispatch;

        if (unreadCount > 0) {
            dispatch((0, _conversation.resetUnreadCount)());
        }
    };

    ChatInputComponent.prototype.onChange = function onChange(e) {
        this.checkAndResetUnreadCount(this.props.unreadCount);
        this.setState({
            text: e.target.value
        });
    };

    ChatInputComponent.prototype.onFocus = function onFocus() {
        this.checkAndResetUnreadCount(this.props.unreadCount);
    };

    ChatInputComponent.prototype.onSendMessage = function onSendMessage(e) {
        e.preventDefault();
        var text = this.state.text;
        var dispatch = this.props.dispatch;

        if (text.trim()) {
            this.setState({
                text: ''
            });
            dispatch((0, _conversation.sendMessage)(text));
            this.refs.input.focus();
        }
    };

    ChatInputComponent.prototype.render = function render() {
        var _props = this.props,
            accentColor = _props.accentColor,
            imageUploadEnabled = _props.imageUploadEnabled,
            inputPlaceholderText = _props.inputPlaceholderText,
            sendButtonText = _props.sendButtonText;


        var sendButton = void 0;

        var buttonClassNames = ['send'];
        var buttonStyle = {};

        if (this.state.text.trim()) {
            buttonClassNames.push('active');

            if (accentColor) {
                buttonStyle.color = '#' + accentColor;
            }
        }

        if (_ismobilejs2.default.apple.device) {
            // Safari on iOS needs a way to send on click, without triggering a mouse event.
            // onTouchStart will do the trick and the input won't lose focus.
            sendButton = _react2.default.createElement(
                'span',
                { ref: 'button',
                    className: buttonClassNames.join(' '),
                    onTouchStart: this.onSendMessage,
                    style: buttonStyle },
                sendButtonText
            );
        } else {
            sendButton = _react2.default.createElement(
                'a',
                { ref: 'button',
                    className: buttonClassNames.join(' '),
                    onClick: this.onSendMessage,
                    style: buttonStyle },
                sendButtonText
            );
        }

        var imageUploadButton = imageUploadEnabled ? _react2.default.createElement(_imageUpload.ImageUpload, { ref: 'imageUpload',
            color: accentColor }) : null;

        var inputContainerClasses = ['input-container'];

        if (!imageUploadEnabled) {
            inputContainerClasses.push('no-upload');
        }

        return _react2.default.createElement(
            'div',
            { id: 'sk-footer' },
            imageUploadButton,
            _react2.default.createElement(
                'form',
                { onSubmit: this.onSendMessage,
                    action: '#' },
                _react2.default.createElement(
                    'div',
                    { className: inputContainerClasses.join(' ') },
                    _react2.default.createElement('input', { ref: 'input',
                        placeholder: inputPlaceholderText,
                        className: 'input message-input',
                        onChange: this.onChange,
                        onFocus: this.onFocus,
                        value: this.state.text,
                        title: sendButtonText })
                )
            ),
            sendButton
        );
    };

    return ChatInputComponent;
}(_react.Component);

ChatInputComponent.propTypes = {
    accentColor: _react.PropTypes.string,
    imageUploadEnabled: _react.PropTypes.bool.isRequired,
    inputPlaceholderText: _react.PropTypes.string.isRequired,
    sendButtonText: _react.PropTypes.string.isRequired,
    unreadCount: _react.PropTypes.number.isRequired,
    dispatch: _react.PropTypes.func.isRequired
};
var ChatInput = exports.ChatInput = (0, _reactRedux.connect)(function (_ref) {
    var appState = _ref.appState,
        app = _ref.app,
        ui = _ref.ui,
        unreadCount = _ref.conversation.unreadCount;

    return {
        imageUploadEnabled: appState.imageUploadEnabled,
        accentColor: app.settings.web.accentColor,
        sendButtonText: ui.text.sendButtonText,
        inputPlaceholderText: ui.text.inputPlaceholder,
        unreadCount: unreadCount
    };
}, undefined, undefined, {
    withRef: true
})(ChatInputComponent);