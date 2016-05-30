'use strict';

exports.__esModule = true;
exports.Widget = exports.WidgetComponent = undefined;

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

var _reactAddonsCssTransitionGroup = require('react-addons-css-transition-group');

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _header = require('./header');

var _conversation = require('./conversation');

var _settings = require('./settings');

var _notification = require('./notification');

var _errorNotification = require('./error-notification');

var _chatInput = require('./chat-input');

var _messageIndicator = require('./message-indicator');

var _conversationService = require('../services/conversation-service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WidgetComponent = exports.WidgetComponent = function (_Component) {
    (0, _inherits3.default)(WidgetComponent, _Component);

    function WidgetComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, WidgetComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onTouchStart = function (e) {
            (0, _conversationService.resetUnreadCount)();
            // the behavior is problematic only on iOS devices
            if (_this.refs.input && _ismobilejs2.default.apple.device) {
                var component = _this.refs.input.getWrappedInstance();
                var node = (0, _reactDom.findDOMNode)(component);

                // only blur if touching outside of the footer
                if (!node.contains(e.target)) {
                    component.blur();
                }
            }
        }, _this.onClick = function () {
            (0, _conversationService.resetUnreadCount)();
        }, _this.onWheel = (0, _lodash2.default)(function () {
            (0, _conversationService.resetUnreadCount)();
        }, 250, {
            leading: true
        }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    WidgetComponent.prototype.render = function render() {
        var settingsComponent = this.props.appState.settingsVisible ? _react2.default.createElement(_settings.Settings, null) : null;
        var footer = this.props.appState.settingsVisible ? null : _react2.default.createElement(_chatInput.ChatInput, { ref: 'input' });

        var classNames = [];

        if (this.props.appState.embedded) {
            classNames.push('sk-embedded');
        } else {
            // `widgetOpened` can have 3 values: `true`, `false`, and `undefined`.
            // `undefined` is basically the default state where the widget was never
            // opened or closed and not visibility class is applied to the widget
            if (this.props.appState.widgetOpened === true) {
                classNames.push('sk-appear');
            } else if (this.props.appState.widgetOpened === false) {
                classNames.push('sk-close');
            }
        }

        if (_ismobilejs2.default.apple.device) {
            classNames.push('sk-ios-device');
        }

        var className = classNames.join(' ');

        var notification = this.props.appState.errorNotificationMessage ? _react2.default.createElement(_errorNotification.ErrorNotification, { message: this.props.appState.errorNotificationMessage }) : this.props.appState.settingsNotificationVisible ? _react2.default.createElement(_notification.Notification, null) : null;

        return _react2.default.createElement(
            'div',
            { id: 'sk-container',
                className: className,
                onTouchStart: this.onTouchStart,
                onClick: this.onClick,
                onWheel: this.onWheel },
            _react2.default.createElement(_messageIndicator.MessageIndicator, null),
            _react2.default.createElement(
                'div',
                { id: 'sk-wrapper' },
                _react2.default.createElement(_header.Header, null),
                _react2.default.createElement(
                    _reactAddonsCssTransitionGroup2.default,
                    { component: 'div',
                        className: 'sk-notification-container',
                        transitionName: 'sk-notification',
                        transitionAppear: true,
                        transitionAppearTimeout: 500,
                        transitionEnterTimeout: 500,
                        transitionLeaveTimeout: 500 },
                    notification
                ),
                _react2.default.createElement(
                    _reactAddonsCssTransitionGroup2.default,
                    { component: 'div',
                        transitionName: 'settings',
                        transitionAppear: true,
                        transitionAppearTimeout: 250,
                        transitionEnterTimeout: 250,
                        transitionLeaveTimeout: 250 },
                    settingsComponent
                ),
                _react2.default.createElement(_conversation.Conversation, null),
                footer
            )
        );
    };

    return WidgetComponent;
}(_react.Component);

var Widget = exports.Widget = (0, _reactRedux.connect)(function (state) {
    return {
        appState: state.appState
    };
})(WidgetComponent);