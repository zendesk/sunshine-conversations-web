'use strict';

exports.__esModule = true;
exports.NotificationsSettings = exports.NotificationsSettingsComponent = exports.ChannelItem = undefined;

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

var _appService = require('../services/app-service');

var _app = require('../utils/app');

var _user = require('../utils/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChannelItem = exports.ChannelItem = function (_Component) {
    (0, _inherits3.default)(ChannelItem, _Component);

    function ChannelItem() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, ChannelItem);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onClick = function () {
            (0, _appService.showChannelPage)(_this.props.id);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    ChannelItem.prototype.render = function render() {
        var _props = this.props;
        var name = _props.name;
        var icon = _props.icon;
        var icon2x = _props.icon2x;
        var linked = _props.linked;
        var hasURL = _props.hasURL;
        var displayName = _props.displayName;
        var _context = this.context;
        var settings = _context.settings;
        var text = _context.ui.text;


        var itemRightStyle = linked && settings.linkColor ? {
            color: '#' + settings.linkColor
        } : null;

        var classNames = ['channel-item'];
        var contentClassNames = ['channel-item-content'];

        if (linked) {
            classNames.push('channel-item-linked');
            contentClassNames.push('linked');
        }

        return _react2.default.createElement(
            'div',
            { className: classNames.join(' '),
                onClick: this.onClick },
            _react2.default.createElement(
                'div',
                { className: 'channel-item-header' },
                _react2.default.createElement('img', { className: 'channel-item-icon',
                    src: icon,
                    srcSet: icon + ' 1x, ' + icon2x + ' 2x' }),
                _react2.default.createElement(
                    'div',
                    { className: contentClassNames.join(' ') },
                    _react2.default.createElement(
                        'div',
                        { className: 'channel-item-name' },
                        name
                    ),
                    linked ? _react2.default.createElement(
                        'div',
                        { className: 'channel-item-connected-as' },
                        text.notificationSettingsConnectedAs.replace('{username}', displayName)
                    ) : null
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'channel-item-right',
                        style: itemRightStyle },
                    hasURL && linked ? 'Open' : _react2.default.createElement('i', { className: 'fa fa-angle-right' })
                )
            )
        );
    };

    return ChannelItem;
}(_react.Component);

ChannelItem.propTypes = {
    id: _react.PropTypes.string.isRequired,
    name: _react.PropTypes.string.isRequired,
    linked: _react.PropTypes.bool.isRequired,
    hasURL: _react.PropTypes.string,
    icon: _react.PropTypes.string.isRequired,
    icon2x: _react.PropTypes.string.isRequired,
    displayName: _react.PropTypes.string
};
ChannelItem.contextTypes = {
    settings: _react.PropTypes.object.isRequired,
    ui: _react.PropTypes.object.isRequired
};

var NotificationsSettingsComponent = exports.NotificationsSettingsComponent = function (_Component2) {
    (0, _inherits3.default)(NotificationsSettingsComponent, _Component2);

    function NotificationsSettingsComponent() {
        (0, _classCallCheck3.default)(this, NotificationsSettingsComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component2.apply(this, arguments));
    }

    NotificationsSettingsComponent.prototype.render = function render() {
        var text = this.context.ui.text;
        var _props2 = this.props;
        var appChannels = _props2.appChannels;
        var user = _props2.user;


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
            var channel = _ref2.channel;
            var details = _ref2.details;

            return _react2.default.createElement(ChannelItem, (0, _extends3.default)({ key: channel.type,
                id: channel.type
            }, details, {
                displayName: (0, _user.getDisplayName)(user.clients, channel.type),
                linked: (0, _user.isChannelLinked)(user.clients, channel.type),
                hasURL: details.getURL && details.getURL(user, channel) }));
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
                    text.notificationSettingsChannelsTitle
                ),
                _react2.default.createElement(
                    'p',
                    { className: 'settings-description' },
                    text.notificationSettingsChannelsDescription
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

NotificationsSettingsComponent.contextTypes = {
    ui: _react.PropTypes.object.isRequired
};
NotificationsSettingsComponent.propTypes = {
    appChannels: _react.PropTypes.array.isRequired,
    user: _react.PropTypes.object.isRequired
};
var NotificationsSettings = exports.NotificationsSettings = (0, _reactRedux.connect)(function (_ref3) {
    var app = _ref3.app;
    var user = _ref3.user;

    return {
        appChannels: app.integrations,
        user: user
    };
})(NotificationsSettingsComponent);