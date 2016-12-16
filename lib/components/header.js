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

var _appService = require('../services/app-service');

var _app = require('../utils/app');

var _channels = require('../constants/channels');

var _app2 = require('../constants/app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HeaderComponent = exports.HeaderComponent = function (_Component) {
    (0, _inherits3.default)(HeaderComponent, _Component);

    function HeaderComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, HeaderComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.hideSettings = function (e) {
            e.stopPropagation();
            var visibleChannelType = _this.props.appState.visibleChannelType;

            if (visibleChannelType) {
                (0, _appService.hideChannelPage)();
            } else {
                (0, _appService.hideSettings)();
            }
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    HeaderComponent.prototype.showSettings = function showSettings(e) {
        e.stopPropagation();
        (0, _appService.showSettings)();
    };

    HeaderComponent.prototype.render = function render() {
        var _props = this.props,
            _props$appState = _props.appState,
            emailCaptureEnabled = _props$appState.emailCaptureEnabled,
            settingsVisible = _props$appState.settingsVisible,
            widgetState = _props$appState.widgetState,
            embedded = _props$appState.embedded,
            visibleChannelType = _props$appState.visibleChannelType,
            unreadCount = _props.unreadCount,
            settings = _props.settings,
            text = _props.text;
        var settingsHeaderText = text.settingsHeaderText,
            headerText = text.headerText;
        var brandColor = settings.brandColor;


        var settingsMode = !!(settingsVisible || visibleChannelType);
        var showSettingsButton = ((0, _app.hasChannels)(settings) || emailCaptureEnabled) && !settingsMode;
        var widgetOpened = widgetState === _app2.WIDGET_STATE.OPENED;

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
                onClick: !embedded && _appService.toggleWidget,
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