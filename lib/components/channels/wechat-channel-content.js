'use strict';

exports.__esModule = true;
exports.WeChatChannelContent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _loading = require('../../components/loading');

var _integrationsService = require('../../services/integrations-service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WeChatChannelContent = exports.WeChatChannelContent = function (_Component) {
    (0, _inherits3.default)(WeChatChannelContent, _Component);

    function WeChatChannelContent() {
        (0, _classCallCheck3.default)(this, WeChatChannelContent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    WeChatChannelContent.prototype.render = function render() {
        var channelState = this.props.channelState;
        var text = this.context.ui.text;


        if (channelState.hasError) {
            return _react2.default.createElement(
                'a',
                { className: 'sk-error-link',
                    onClick: _integrationsService.fetchWeChatQRCode },
                text.wechatQRCodeError
            );
        }

        if (channelState.qrCode) {
            return _react2.default.createElement('img', { style: { width: '40%' },
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

    return WeChatChannelContent;
}(_react.Component);

WeChatChannelContent.contextTypes = {
    ui: _react.PropTypes.object
};
WeChatChannelContent.propTypes = {
    channelState: _react.PropTypes.object.isRequired
};