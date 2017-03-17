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

var _messengerButton = require('./messenger-button');

var _header = require('./header');

var _conversation = require('./conversation');

var _settings = require('./settings');

var _channel = require('./channels/channel');

var _errorNotification = require('./error-notification');

var _chatInput = require('./chat-input');

var _messageIndicator = require('./message-indicator');

var _conversation2 = require('../services/conversation');

var _app = require('../utils/app');

var _styles = require('../constants/styles');

var _app2 = require('../constants/app');

var _appStateActions = require('../actions/app-state-actions');

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
            (0, _conversation2.resetUnreadCount)();
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
            (0, _conversation2.resetUnreadCount)();
        }, _this.handleResize = function () {
            _this.props.dispatch((0, _appStateActions.disableAnimation)());
        }, _this.componentDidMount = function () {
            window.addEventListener('resize', _this.handleResize);
        }, _this.componentWillUnmount = function () {
            window.removeEventListener('resize', _this.handleResize);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    WidgetComponent.prototype.render = function render() {
        var _props = this.props,
            appState = _props.appState,
            settings = _props.settings,
            smoochId = _props.smoochId;
        var displayStyle = settings.displayStyle,
            isBrandColorDark = settings.isBrandColorDark,
            isAccentColorDark = settings.isAccentColorDark,
            isLinkColorDark = settings.isLinkColorDark;


        var settingsComponent = appState.settingsVisible ? _react2.default.createElement(_settings.Settings, null) : null;

        // if no user set in store or the app has no channels,
        // no need to render the channel page manager
        var channelsComponent = smoochId && (0, _app.hasChannels)(settings) ? _react2.default.createElement(_channel.Channel, null) : null;

        var footer = appState.settingsVisible ? null : _react2.default.createElement(_chatInput.ChatInput, { ref: 'input' });

        var classNames = ['sk-' + displayStyle + '-display'];

        if (appState.embedded) {
            classNames.push('sk-embedded');
        } else {
            if (appState.widgetState === _app2.WIDGET_STATE.OPENED) {
                classNames.push('sk-appear');
            } else if (appState.widgetState === _app2.WIDGET_STATE.CLOSED) {
                classNames.push('sk-close');
            } else {
                // state is WIDGET_STATE.INIT
                classNames.push('sk-init');
            }
        }

        if (_ismobilejs2.default.apple.device) {
            classNames.push('sk-ios-device');
        }

        if (appState.showAnimation) {
            classNames.push('sk-animation');
        }

        var notification = appState.errorNotificationMessage ? _react2.default.createElement(_errorNotification.ErrorNotification, { message: appState.errorNotificationMessage }) : null;

        var wrapperClassNames = ['sk-branding-color-' + (isBrandColorDark ? 'dark' : 'light'), 'sk-accent-color-' + (isAccentColorDark ? 'dark' : 'light'), 'sk-link-color-' + (isLinkColorDark ? 'dark' : 'light')];

        var messengerButton = void 0;

        if (displayStyle === _styles.DISPLAY_STYLE.BUTTON && !appState.embedded) {
            messengerButton = _react2.default.createElement(_messengerButton.MessengerButton, { shown: appState.widgetState !== _app2.WIDGET_STATE.OPENED });
        }

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'div',
                { id: 'sk-container',
                    className: classNames.join(' '),
                    onTouchStart: this.onTouchStart,
                    onClick: this.onClick },
                _react2.default.createElement(_messageIndicator.MessageIndicator, null),
                _react2.default.createElement(
                    'div',
                    { id: 'sk-wrapper',
                        className: wrapperClassNames.join(' ') },
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
                    channelsComponent,
                    _react2.default.createElement(_conversation.Conversation, null),
                    footer
                )
            ),
            messengerButton
        );
    };

    return WidgetComponent;
}(_react.Component);

WidgetComponent.propTypes = {
    smoochId: _react.PropTypes.string,
    app: _react.PropTypes.object.isRequired,
    settings: _react.PropTypes.object.isRequired,
    ui: _react.PropTypes.object.isRequired,
    appState: _react.PropTypes.object.isRequired
};
var Widget = exports.Widget = (0, _reactRedux.connect)(function (_ref) {
    var _ref$appState = _ref.appState,
        settingsVisible = _ref$appState.settingsVisible,
        widgetState = _ref$appState.widgetState,
        errorNotificationMessage = _ref$appState.errorNotificationMessage,
        embedded = _ref$appState.embedded,
        showAnimation = _ref$appState.showAnimation,
        app = _ref.app,
        ui = _ref.ui,
        user = _ref.user;

    // only extract what is needed from appState as this is something that might
    // mutate a lot
    return {
        appState: {
            settingsVisible: settingsVisible,
            widgetState: widgetState,
            errorNotificationMessage: errorNotificationMessage,
            embedded: embedded,
            showAnimation: showAnimation
        },
        app: app,
        settings: app.settings.web,
        ui: ui,
        smoochId: user._id
    };
})(WidgetComponent);