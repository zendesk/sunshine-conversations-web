'use strict';

exports.__esModule = true;
exports.MessengerChannelContent = exports.MessengerChannelContentComponent = undefined;

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

var MessengerChannelContentComponent = exports.MessengerChannelContentComponent = function (_Component) {
    (0, _inherits3.default)(MessengerChannelContentComponent, _Component);

    function MessengerChannelContentComponent() {
        (0, _classCallCheck3.default)(this, MessengerChannelContentComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    MessengerChannelContentComponent.prototype.render = function render() {
        var _props = this.props,
            pageId = _props.pageId,
            channelState = _props.channelState;

        var url = 'https://m.me/' + pageId + '?ref=' + channelState.transferRequestCode;
        return _react2.default.createElement(_transferRequestChannelContent.TransferRequestChannelContent, { type: 'messenger',
            channelState: channelState,
            url: url });
    };

    return MessengerChannelContentComponent;
}(_react.Component);

MessengerChannelContentComponent.propTypes = {
    pageId: _react.PropTypes.string.isRequired,
    channelState: _react.PropTypes.object.isRequired
};
var MessengerChannelContent = exports.MessengerChannelContent = (0, _reactRedux.connect)()(MessengerChannelContentComponent);