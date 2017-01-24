'use strict';

exports.__esModule = true;
exports.EmailChannelContent = exports.EmailChannelContentComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EmailChannelContentComponent = exports.EmailChannelContentComponent = function (_Component) {
    (0, _inherits3.default)(EmailChannelContentComponent, _Component);

    function EmailChannelContentComponent() {
        (0, _classCallCheck3.default)(this, EmailChannelContentComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    EmailChannelContentComponent.prototype.render = function render() {
        var _props = this.props,
            linkColor = _props.linkColor,
            fromAddress = _props.fromAddress,
            smoochAddress = _props.smoochAddress;

        var email = fromAddress || smoochAddress;

        var styleOverride = linkColor ? {
            color: '#' + linkColor
        } : null;

        return _react2.default.createElement(
            'a',
            { href: 'mailto:' + email,
                style: styleOverride,
                target: '_blank' },
            email
        );
    };

    return EmailChannelContentComponent;
}(_react.Component);

EmailChannelContentComponent.propTypes = {
    linkColor: _react.PropTypes.string,
    fromAddress: _react.PropTypes.string,
    smoochAddress: _react.PropTypes.string.isRequired
};
var EmailChannelContent = exports.EmailChannelContent = (0, _reactRedux.connect)(function (_ref) {
    var app = _ref.app;

    return {
        linkColor: app.settings.web.linkColor
    };
})(EmailChannelContentComponent);