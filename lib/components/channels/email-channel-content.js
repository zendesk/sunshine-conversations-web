'use strict';

exports.__esModule = true;
exports.EmailChannelContent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EmailChannelContent = exports.EmailChannelContent = function (_Component) {
    (0, _inherits3.default)(EmailChannelContent, _Component);

    function EmailChannelContent() {
        (0, _classCallCheck3.default)(this, EmailChannelContent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    EmailChannelContent.prototype.render = function render() {
        var settings = this.context.settings;
        var _props = this.props;
        var fromAddress = _props.fromAddress;
        var smoochAddress = _props.smoochAddress;

        var email = fromAddress || smoochAddress;

        var styleOverride = settings.linkColor ? {
            color: '#' + settings.linkColor
        } : null;

        return _react2.default.createElement(
            'a',
            { href: 'mailto:' + email,
                style: styleOverride,
                target: '_blank' },
            email
        );
    };

    return EmailChannelContent;
}(_react.Component);

EmailChannelContent.contextTypes = {
    settings: _react.PropTypes.object
};