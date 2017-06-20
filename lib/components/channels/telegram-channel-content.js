'use strict';

exports.__esModule = true;
exports.TelegramChannelContent = exports.TelegramChannelContentComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _transferRequestChannelContent = require('./transfer-request-channel-content');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TelegramChannelContentComponent = exports.TelegramChannelContentComponent = function (_Component) {
    (0, _inherits3.default)(TelegramChannelContentComponent, _Component);

    function TelegramChannelContentComponent() {
        (0, _classCallCheck3.default)(this, TelegramChannelContentComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    TelegramChannelContentComponent.prototype.render = function render() {
        var _props = this.props,
            username = _props.username,
            channelState = _props.channelState;

        var url = 'https://telegram.me/' + username + '?start=' + channelState.transferRequestCode;
        return _react2.default.createElement(_transferRequestChannelContent.TransferRequestChannelContent, { type: 'telegram',
            channelState: channelState,
            url: url });
    };

    return TelegramChannelContentComponent;
}(_react.Component);

TelegramChannelContentComponent.propTypes = {
    channelState: _react.PropTypes.object.isRequired,
    username: _react.PropTypes.string.isRequired
};
var TelegramChannelContent = exports.TelegramChannelContent = (0, _reactRedux.connect)()(TelegramChannelContentComponent);