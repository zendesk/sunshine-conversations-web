'use strict';

exports.__esModule = true;
exports.ViberChannelContent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _loading = require('../../components/loading');

var _integrations = require('../../services/integrations');

var _transferRequestChannelContent = require('./transfer-request-channel-content');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViberChannelContentComponent = function (_Component) {
    (0, _inherits3.default)(ViberChannelContentComponent, _Component);

    function ViberChannelContentComponent() {
        (0, _classCallCheck3.default)(this, ViberChannelContentComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    ViberChannelContentComponent.prototype.render = function render() {
        var _props = this.props,
            uri = _props.uri,
            channelState = _props.channelState,
            text = _props.ui.text;

        if (_ismobilejs2.default.any) {
            var url = 'viber://pa?chatURI=' + uri + '&context=' + channelState.transferRequestCode;
            return _react2.default.createElement(_transferRequestChannelContent.TransferRequestChannelContent, { type: 'viber',
                channelState: channelState,
                url: url });
        }

        if (channelState.hasError) {
            return _react2.default.createElement(
                'a',
                { className: 'sk-error-link',
                    onClick: _integrations.fetchViberQRCode },
                text.viberQRCodeError
            );
        }

        if (channelState.qrCode) {
            return _react2.default.createElement('img', { alt: 'Viber QR Code',
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

    return ViberChannelContentComponent;
}(_react.Component);

ViberChannelContentComponent.propTypes = {
    channelState: _react.PropTypes.object.isRequired,
    ui: _react.PropTypes.object.isRequired
};
var ViberChannelContent = exports.ViberChannelContent = (0, _reactRedux.connect)(function (_ref) {
    var ui = _ref.ui;

    return {
        ui: ui
    };
})(ViberChannelContentComponent);