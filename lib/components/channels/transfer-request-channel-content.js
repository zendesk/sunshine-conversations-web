'use strict';

exports.__esModule = true;
exports.TransferRequestChannelContent = exports.TransferRequestChannelContentComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reduxBatchedActions = require('redux-batched-actions');

var _app = require('../../services/app');

var _loading = require('../../components/loading');

var _integrationsActions = require('../../actions/integrations-actions');

var _integrations = require('../../services/integrations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TransferRequestChannelContentComponent = exports.TransferRequestChannelContentComponent = function (_Component) {
    (0, _inherits3.default)(TransferRequestChannelContentComponent, _Component);

    function TransferRequestChannelContentComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, TransferRequestChannelContentComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onLink = function () {
            var _this$props = _this.props,
                dispatch = _this$props.dispatch,
                type = _this$props.type;

            dispatch((0, _integrationsActions.resetTransferRequestCode)(type));
            dispatch((0, _app.hideChannelPage)());
        }, _this.onTryAgain = function () {
            var _this$props2 = _this.props,
                dispatch = _this$props2.dispatch,
                type = _this$props2.type;

            dispatch((0, _reduxBatchedActions.batchActions)([(0, _integrationsActions.unsetError)(type), (0, _integrationsActions.resetTransferRequestCode)(type)]));
            dispatch((0, _integrations.fetchTransferRequestCode)(type));
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    TransferRequestChannelContentComponent.prototype.render = function render() {
        var _props = this.props,
            type = _props.type,
            channelState = _props.channelState,
            url = _props.url,
            transferError = _props.transferError;
        var transferRequestCode = channelState.transferRequestCode,
            hasError = channelState.hasError;


        if (hasError) {
            return _react2.default.createElement(
                'a',
                { className: 'sk-error-link',
                    onClick: this.onTryAgain },
                transferError
            );
        }

        if (transferRequestCode) {
            return _react2.default.createElement(
                'a',
                { alt: 'Connect',
                    target: '_blank',
                    onClick: this.onLink,
                    href: url },
                'Connect'
            );
        }

        var loadingStyle = {
            height: '40px',
            width: '40px',
            margin: 'auto'
        };

        return _react2.default.createElement(_loading.LoadingComponent, { dark: true,
            style: loadingStyle });
    };

    return TransferRequestChannelContentComponent;
}(_react.Component);

TransferRequestChannelContentComponent.propTypes = {
    url: _react.PropTypes.string.isRequired,
    channelState: _react.PropTypes.object.isRequired,
    transferError: _react.PropTypes.string
};
var TransferRequestChannelContent = exports.TransferRequestChannelContent = (0, _reactRedux.connect)(function (_ref) {
    var text = _ref.ui.text;

    return {
        transferError: text.transferError
    };
})(TransferRequestChannelContentComponent);