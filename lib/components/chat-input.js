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

var _conversationService = require('../services/conversation-service');

var _appStore = require('../stores/app-store');

var _imageUpload = require('./image-upload');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkAndResetUnreadCount() {
    if (_appStore.store.getState().conversation.unreadCount > 0) {
        (0, _conversationService.resetUnreadCount)();
    }
}

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

        _this.onChange = _this.onChange.bind(_this);
        _this.onSendMessage = _this.onSendMessage.bind(_this);
        return _this;
    }

    ChatInputComponent.prototype.blur = function blur() {
        this.refs.input.blur();
    };

    ChatInputComponent.prototype.onChange = function onChange(e) {
        checkAndResetUnreadCount();
        this.setState({
            text: e.target.value
        });
    };

    ChatInputComponent.prototype.onFocus = function onFocus() {
        checkAndResetUnreadCount();
    };

    ChatInputComponent.prototype.onSendMessage = function onSendMessage(e) {
        e.preventDefault();
        var text = this.state.text;
        if (text.trim()) {
            this.setState({
                text: ''
            });
            (0, _conversationService.sendMessage)(text);
            this.refs.input.focus();
        }
    };

    ChatInputComponent.prototype.render = function render() {
        var _props = this.props,
            linkColor = _props.linkColor,
            imageUploadEnabled = _props.imageUploadEnabled,
            inputPlaceholderText = _props.inputPlaceholderText,
            sendButtonText = _props.sendButtonText;


        var sendButton = void 0;

        var buttonClassNames = ['send'];
        var buttonStyle = {};

        if (this.state.text.trim()) {
            buttonClassNames.push('active');

            if (linkColor) {
                buttonStyle.color = '#' + linkColor;
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
            color: linkColor }) : null;

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

var ChatInput = exports.ChatInput = (0, _reactRedux.connect)(function (_ref) {
    var appState = _ref.appState,
        app = _ref.app,
        ui = _ref.ui;

    return {
        imageUploadEnabled: appState.imageUploadEnabled,
        linkColor: app.settings.web.linkColor,
        sendButtonText: ui.text.sendButtonText,
        inputPlaceholderText: ui.text.inputPlaceholder
    };
}, undefined, undefined, {
    withRef: true
})(ChatInputComponent);