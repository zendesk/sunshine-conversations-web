'use strict';

exports.__esModule = true;
exports.Channel = exports.ChannelComponent = undefined;

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

var _channelPage = require('./channel-page');

var _user = require('../../utils/user');

var _app = require('../../utils/app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChannelComponent = exports.ChannelComponent = function (_Component) {
    (0, _inherits3.default)(ChannelComponent, _Component);

    function ChannelComponent() {
        (0, _classCallCheck3.default)(this, ChannelComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    ChannelComponent.prototype.render = function render() {
        var _props = this.props;
        var appChannels = _props.appChannels;
        var visibleChannelType = _props.visibleChannelType;
        var smoochId = _props.smoochId;
        var clients = _props.clients;
        var channelStates = _props.channelStates;


        if (!smoochId) {
            return null;
        }

        var channelPages = (0, _app.getAppChannelDetails)(appChannels).map(function (_ref) {
            var channel = _ref.channel;
            var details = _ref.details;

            if (!details.Component || (0, _user.isChannelLinked)(clients, channel.type) && !details.renderPageIfLinked) {
                return null;
            }

            return _react2.default.createElement(
                _channelPage.ChannelPage,
                (0, _extends3.default)({ key: channel.type
                }, details, {
                    icon: details.iconLarge,
                    icon2x: details.iconLarge2x,
                    visible: channel.type === visibleChannelType }),
                _react2.default.createElement(details.Component, (0, _extends3.default)({}, channel, {
                    channelState: channelStates[channel.type],
                    getContent: details.getContent,
                    smoochId: smoochId }))
            );
        });

        return _react2.default.createElement(
            'div',
            { className: 'channel-pages-container' },
            channelPages
        );
    };

    return ChannelComponent;
}(_react.Component);

ChannelComponent.propTypes = {
    appChannels: _react.PropTypes.array.isRequired,
    channelStates: _react.PropTypes.object.isRequired,
    visibleChannelType: _react.PropTypes.string,
    smoochId: _react.PropTypes.string,
    clients: _react.PropTypes.array
};
var Channel = exports.Channel = (0, _reactRedux.connect)(function (_ref2) {
    var appState = _ref2.appState;
    var app = _ref2.app;
    var user = _ref2.user;
    var integrations = _ref2.integrations;

    var channelType = appState.visibleChannelType;
    return {
        visibleChannelType: channelType,
        appChannels: app.integrations,
        channelStates: integrations,
        smoochId: user._id,
        clients: user.clients
    };
})(ChannelComponent);