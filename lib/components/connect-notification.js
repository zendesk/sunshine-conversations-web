'use strict';

exports.__esModule = true;
exports.ConnectNotification = exports.ConnectNotificationComponent = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactDom = require('react-dom');

var _app = require('../utils/app');

var _html = require('../utils/html');

var _appService = require('../services/app-service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConnectNotificationComponent = exports.ConnectNotificationComponent = function (_Component) {
    (0, _inherits3.default)(ConnectNotificationComponent, _Component);

    function ConnectNotificationComponent() {
        (0, _classCallCheck3.default)(this, ConnectNotificationComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    ConnectNotificationComponent.prototype.bindHandler = function bindHandler() {
        var node = (0, _reactDom.findDOMNode)(this);
        if (node) {
            var linkNode = node.querySelector('[data-ui-settings-link]');
            var linkColor = this.context.settings.linkColor;

            if (linkNode) {
                linkNode.onclick = function (e) {
                    e.preventDefault();
                    (0, _appService.showSettings)();
                };

                if (linkColor) {
                    linkNode.style = 'color: #' + linkColor;
                }
            }
        }
    };

    ConnectNotificationComponent.prototype.componentDidMount = function componentDidMount() {
        this.bindHandler();
    };

    ConnectNotificationComponent.prototype.componentDidUpdate = function componentDidUpdate() {
        this.bindHandler();
    };

    ConnectNotificationComponent.prototype.render = function render() {
        var _context = this.context,
            _context$ui$text = _context.ui.text,
            connectNotificationText = _context$ui$text.connectNotificationText,
            settingsNotificationText = _context$ui$text.settingsNotificationText,
            settings = _context.settings;
        var _props = this.props,
            appChannels = _props.appChannels,
            emailCaptureEnabled = _props.emailCaptureEnabled;


        var isConnectNotification = (0, _app.hasChannels)(settings);

        if (isConnectNotification) {
            var _ret = function () {
                var linkStyle = settings.linkColor ? {
                    color: '#' + settings.linkColor
                } : null;

                var channels = (0, _app.getAppChannelDetails)(appChannels).filter(function (_ref) {
                    var details = _ref.details;
                    return details.isLinkable;
                }).map(function (_ref2, index, array) {
                    var channel = _ref2.channel,
                        details = _ref2.details;

                    var onClick = function onClick(e) {
                        e.preventDefault();
                        (0, _appService.showChannelPage)(channel.type);
                    };

                    var separator = index !== array.length - 1 ? ',' : '';

                    return _react2.default.createElement(
                        'div',
                        { style: linkStyle,
                            className: 'channel-details',
                            key: channel.type },
                        _react2.default.createElement(
                            'a',
                            { style: linkStyle,
                                href: true,
                                className: 'channel-link',
                                onClick: onClick },
                            details.name
                        ),
                        separator
                    );
                });

                return {
                    v: _react2.default.createElement(
                        'div',
                        { className: 'connect-notification' },
                        _react2.default.createElement(
                            'p',
                            null,
                            connectNotificationText
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'connect-notification-channels' },
                            channels
                        )
                    )
                };
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
        }

        if (emailCaptureEnabled) {
            return _react2.default.createElement(
                'div',
                { className: 'connect-notification' },
                _react2.default.createElement('span', { ref: 'text',
                    dangerouslySetInnerHTML: (0, _html.createMarkup)(settingsNotificationText) })
            );
        }

        return null;
    };

    return ConnectNotificationComponent;
}(_react.Component);

ConnectNotificationComponent.propTypes = {
    appChannels: _react.PropTypes.array.isRequired,
    emailCaptureEnabled: _react.PropTypes.bool.isRequired
};
ConnectNotificationComponent.contextTypes = {
    ui: _react.PropTypes.object.isRequired,
    settings: _react.PropTypes.object.isRequired
};
var ConnectNotification = exports.ConnectNotification = (0, _reactRedux.connect)(function (_ref3) {
    var app = _ref3.app,
        appState = _ref3.appState;

    return {
        appChannels: app.integrations,
        emailCaptureEnabled: appState.emailCaptureEnabled
    };
})(ConnectNotificationComponent);