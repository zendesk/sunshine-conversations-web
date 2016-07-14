'use strict';

exports.__esModule = true;
exports.TwilioChannelContent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TwilioChannelContent = exports.TwilioChannelContent = function (_Component) {
    (0, _inherits3.default)(TwilioChannelContent, _Component);

    function TwilioChannelContent() {
        (0, _classCallCheck3.default)(this, TwilioChannelContent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    TwilioChannelContent.prototype.render = function render() {
        var settings = this.context.settings;
        var phoneNumber = this.props.phoneNumber;

        var styleOverride = settings.linkColor ? {
            color: '#' + settings.linkColor
        } : null;

        if (_ismobilejs2.default.any) {
            return _react2.default.createElement(
                'a',
                { href: 'sms:' + phoneNumber,
                    style: styleOverride },
                phoneNumber
            );
        }
        return _react2.default.createElement(
            'span',
            { className: 'channel-content-value' },
            phoneNumber
        );
    };

    return TwilioChannelContent;
}(_react.Component);

TwilioChannelContent.contextTypes = {
    settings: _react.PropTypes.object.isRequired
};