'use strict';

exports.__esModule = true;
exports.NotificationsSettings = exports.NotificationsSettingsComponent = undefined;

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

var _reactRedux = require('react-redux');

var _notificationChannelItem = require('./notification-channel-item');

var _app = require('../utils/app');

var _user = require('../utils/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotificationsSettingsComponent = exports.NotificationsSettingsComponent = function (_Component) {
    (0, _inherits3.default)(NotificationsSettingsComponent, _Component);

    function NotificationsSettingsComponent() {
        (0, _classCallCheck3.default)(this, NotificationsSettingsComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    NotificationsSettingsComponent.prototype.render = function render() {
        var _props = this.props,
            appChannels = _props.appChannels,
            user = _props.user,
            notificationSettingsChannelsTitleText = _props.notificationSettingsChannelsTitleText,
            notificationSettingsChannelsDescriptionText = _props.notificationSettingsChannelsDescriptionText;


        if (!user._id) {
            return null;
        }

        var channels = (0, _app.getAppChannelDetails)(appChannels);
        channels.sort(function (_ref) {
            var channel = _ref.channel;

            // List the linked channels first
            return (0, _user.isChannelLinked)(user.clients, channel.type) ? -1 : 1;
        });

        channels = channels.map(function (_ref2) {
            var channel = _ref2.channel,
                details = _ref2.details;

            return _react2.default.createElement(_notificationChannelItem.NotificationChannelItem, (0, _extends3.default)({ key: channel.type,
                id: channel.type
            }, details, {
                displayName: (0, _user.getDisplayName)(user.clients, channel.type),
                linked: (0, _user.isChannelLinked)(user.clients, channel.type),
                hasURL: !!details.getURL(channel) }));
        });

        return _react2.default.createElement(
            'div',
            { className: 'content-wrapper' },
            _react2.default.createElement(
                'div',
                { className: 'settings-wrapper' },
                _react2.default.createElement(
                    'p',
                    { className: 'settings-header' },
                    notificationSettingsChannelsTitleText
                ),
                _react2.default.createElement(
                    'p',
                    { className: 'settings-description' },
                    notificationSettingsChannelsDescriptionText
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'channels' },
                    channels
                )
            )
        );
    };

    return NotificationsSettingsComponent;
}(_react.Component);

NotificationsSettingsComponent.propTypes = {
    appChannels: _react.PropTypes.array.isRequired,
    user: _react.PropTypes.object.isRequired,
    notificationSettingsChannelsTitleText: _react.PropTypes.string.isRequired,
    notificationSettingsChannelsDescriptionText: _react.PropTypes.string.isRequired
};
var NotificationsSettings = exports.NotificationsSettings = (0, _reactRedux.connect)(function (_ref3) {
    var app = _ref3.app,
        user = _ref3.user,
        ui = _ref3.ui;

    return {
        appChannels: app.integrations,
        notificationSettingsChannelsTitleText: ui.text.notificationSettingsChannelsTitle,
        notificationSettingsChannelsDescriptionText: ui.text.notificationSettingsChannelsDescription,
        user: user
    };
})(NotificationsSettingsComponent);