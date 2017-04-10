'use strict';

exports.__esModule = true;
exports.Header = exports.HeaderComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _lodash = require('lodash.bindall');

var _lodash2 = _interopRequireDefault(_lodash);

var _app = require('../services/app');

var _app2 = require('../utils/app');

var _channels = require('../constants/channels');

var _app3 = require('../constants/app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HeaderComponent = exports.HeaderComponent = function (_Component) {
    (0, _inherits3.default)(HeaderComponent, _Component);

    function HeaderComponent() {
        (0, _classCallCheck3.default)(this, HeaderComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        (0, _lodash2.default)(_this, 'showSettings', 'hideSettings', 'onClick');
        return _this;
    }

    HeaderComponent.prototype.showSettings = function showSettings(e) {
        var dispatch = this.props.dispatch;

        e.stopPropagation();
        dispatch((0, _app.showSettings)());
    };

    HeaderComponent.prototype.hideSettings = function hideSettings(e) {
        e.stopPropagation();
        var _props = this.props,
            dispatch = _props.dispatch,
            visibleChannelType = _props.appState.visibleChannelType;

        if (visibleChannelType) {
            dispatch((0, _app.hideChannelPage)());
        } else {
            dispatch((0, _app.hideSettings)());
        }
    };

    HeaderComponent.prototype.onClick = function onClick(e) {
        e.preventDefault();
        var _props2 = this.props,
            dispatch = _props2.dispatch,
            embedded = _props2.appState.embedded;

        if (!embedded) {
            dispatch((0, _app.toggleWidget)());
        }
    };

    HeaderComponent.prototype.render = function render() {
        var _props3 = this.props,
            _props3$appState = _props3.appState,
            emailCaptureEnabled = _props3$appState.emailCaptureEnabled,
            settingsVisible = _props3$appState.settingsVisible,
            widgetState = _props3$appState.widgetState,
            embedded = _props3$appState.embedded,
            visibleChannelType = _props3$appState.visibleChannelType,
            unreadCount = _props3.unreadCount,
            settings = _props3.settings,
            text = _props3.text;
        var settingsHeaderText = text.settingsHeaderText,
            headerText = text.headerText;
        var brandColor = settings.brandColor;


        var settingsMode = !!(settingsVisible || visibleChannelType);
        var showSettingsButton = ((0, _app2.hasChannels)(settings) || emailCaptureEnabled) && !settingsMode;
        var widgetOpened = widgetState === _app3.WIDGET_STATE.OPENED;

        var unreadBadge = !settingsMode && unreadCount > 0 ? _react2.default.createElement(
            'div',
            { className: 'unread-badge' },
            unreadCount
        ) : null;

        var settingsButton = showSettingsButton ? _react2.default.createElement(
            'div',
            { id: 'sk-settings-handle',
                onClick: this.showSettings },
            _react2.default.createElement('i', { className: 'fa fa-ellipsis-h' })
        ) : null;

        var backButton = widgetOpened && settingsMode ? _react2.default.createElement(
            'div',
            { className: 'sk-back-handle',
                onClick: this.hideSettings },
            _react2.default.createElement('i', { className: 'fa fa-arrow-left' })
        ) : null;

        var closeHandle = null;
        if (!embedded) {
            closeHandle = widgetOpened ? _react2.default.createElement(
                'div',
                { className: 'sk-close-handle sk-close-hidden' },
                _react2.default.createElement('i', { className: 'fa fa-times' })
            ) : null;
        }

        var settingsTextStyle = {
            display: 'inline-block',
            height: 30,
            cursor: 'pointer'
        };

        var settingsText = _react2.default.createElement(
            'div',
            { className: 'settings-content',
                onClick: this.hideSettings },
            _react2.default.createElement(
                'div',
                { style: settingsTextStyle },
                backButton,
                visibleChannelType ? _channels.CHANNEL_DETAILS[visibleChannelType].name : settingsHeaderText
            )
        );

        var style = void 0;
        if (brandColor) {
            style = {
                backgroundColor: '#' + brandColor
            };
        }

        return _react2.default.createElement(
            'div',
            { id: settingsMode ? 'sk-settings-header' : 'sk-header',
                onClick: this.onClick,
                className: 'sk-header-wrapper',
                style: style },
            settingsButton,
            settingsMode ? settingsText : headerText,
            unreadBadge,
            closeHandle
        );
    };

    return HeaderComponent;
}(_react.Component);

HeaderComponent.propTypes = {
    appState: _react.PropTypes.object.isRequired,
    settings: _react.PropTypes.object.isRequired,
    text: _react.PropTypes.object.isRequired,
    unreadCount: _react.PropTypes.number.isRequired
};


function mapStateToProps(_ref) {
    var app = _ref.app,
        text = _ref.ui.text,
        _ref$appState = _ref.appState,
        emailCaptureEnabled = _ref$appState.emailCaptureEnabled,
        settingsVisible = _ref$appState.settingsVisible,
        widgetState = _ref$appState.widgetState,
        embedded = _ref$appState.embedded,
        visibleChannelType = _ref$appState.visibleChannelType,
        conversation = _ref.conversation;

    return {
        appState: {
            emailCaptureEnabled: emailCaptureEnabled,
            settingsVisible: settingsVisible,
            widgetState: widgetState,
            embedded: embedded,
            visibleChannelType: visibleChannelType
        },
        unreadCount: conversation.unreadCount,
        settings: app.settings.web,
        text: text
    };
}

var Header = exports.Header = (0, _reactRedux.connect)(mapStateToProps)(HeaderComponent);