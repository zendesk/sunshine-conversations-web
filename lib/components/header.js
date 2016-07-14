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
        var _props = this.props;
        var _props$appState = _props.appState;
        var emailCaptureEnabled = _props$appState.emailCaptureEnabled;
        var settingsVisible = _props$appState.settingsVisible;
        var widgetOpened = _props$appState.widgetOpened;
        var embedded = _props$appState.embedded;
        var visibleChannelType = _props$appState.visibleChannelType;
        var unreadCount = _props.unreadCount;
        var _context = this.context;
        var ui = _context.ui;
        var settings = _context.settings;
        var _ui$text = ui.text;
        var settingsHeaderText = _ui$text.settingsHeaderText;
        var headerText = _ui$text.headerText;


        var settingsMode = !!(settingsVisible || visibleChannelType);
        var showSettingsButton = ((0, _app.hasChannels)(settings) || emailCaptureEnabled) && !settingsMode;

        var unreadBadge = !settingsMode && unreadCount > 0 ? _react2.default.createElement(
            'div',
            { id: 'sk-badge' },
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
            ) : _react2.default.createElement(
                'div',
                { className: 'sk-show-handle sk-appear-hidden' },
                _react2.default.createElement('i', { className: 'fa fa-arrow-up' })
            );
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

        return _react2.default.createElement(
            'div',
            { id: settingsMode ? 'sk-settings-header' : 'sk-header',
                onClick: !embedded && _appService.toggleWidget,
                className: 'sk-header-wrapper' },
            settingsButton,
            settingsMode ? settingsText : headerText,
            unreadBadge,
            closeHandle
        );
    };

    return HeaderComponent;
}(_react.Component);

HeaderComponent.contextTypes = {
    ui: _react.PropTypes.object.isRequired,
    settings: _react.PropTypes.object.isRequired
};


function mapStateToProps(_ref) {
    var _ref$appState = _ref.appState;
    var emailCaptureEnabled = _ref$appState.emailCaptureEnabled;
    var settingsVisible = _ref$appState.settingsVisible;
    var widgetOpened = _ref$appState.widgetOpened;
    var embedded = _ref$appState.embedded;
    var visibleChannelType = _ref$appState.visibleChannelType;
    var conversation = _ref.conversation;

    return {
        appState: {
            emailCaptureEnabled: emailCaptureEnabled,
            settingsVisible: settingsVisible,
            widgetOpened: widgetOpened,
            embedded: embedded,
            visibleChannelType: visibleChannelType
        },
        unreadCount: conversation.unreadCount
    };
}

var Header = exports.Header = (0, _reactRedux.connect)(mapStateToProps)(HeaderComponent);