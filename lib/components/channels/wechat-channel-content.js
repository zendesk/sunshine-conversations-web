'use strict';

exports.__esModule = true;
exports.WeChatChannelContent = exports.WeChatChannelContentComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _loading = require('../../components/loading');

var _integrations = require('../../services/integrations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WeChatChannelContentComponent = exports.WeChatChannelContentComponent = function (_Component) {
    (0, _inherits3.default)(WeChatChannelContentComponent, _Component);

    function WeChatChannelContentComponent() {
        (0, _classCallCheck3.default)(this, WeChatChannelContentComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    WeChatChannelContentComponent.prototype.render = function render() {
        var _props = this.props,
            channelState = _props.channelState,
            qrCodeError = _props.qrCodeError;


        if (channelState.hasError) {
            return _react2.default.createElement(
                'a',
                { className: 'sk-error-link',
                    onClick: _integrations.fetchWeChatQRCode },
                qrCodeError
            );
        }

        if (channelState.qrCode) {
            return _react2.default.createElement('img', { alt: 'WeChat QR Code',
                style: { width: '40%' },
                src: channelState.qrCode });
        }

        var loadingStyle = {
            height: 40,
            width: 40,
            margin: 'auto'
        };

        return _react2.default.createElement(_loading.LoadingComponent, { dark: true,
            style: loadingStyle });
    };

    return WeChatChannelContentComponent;
}(_react.Component);

WeChatChannelContentComponent.propTypes = {
    channelState: _react.PropTypes.object.isRequired,
    qrCodeError: _react.PropTypes.string.isRequired
};
var WeChatChannelContent = exports.WeChatChannelContent = (0, _reactRedux.connect)(function (_ref) {
    var text = _ref.ui.text;

    return {
        qrCodeError: text.wechatQRCodeError
    };
})(WeChatChannelContentComponent);