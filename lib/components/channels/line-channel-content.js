'use strict';

exports.__esModule = true;
exports.LineChannelContent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LineChannelContent = exports.LineChannelContent = function (_Component) {
    (0, _inherits3.default)(LineChannelContent, _Component);

    function LineChannelContent() {
        (0, _classCallCheck3.default)(this, LineChannelContent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    LineChannelContent.prototype.render = function render() {
        var botName = this.props.botName;


        return _react2.default.createElement(
            'span',
            { className: 'channel-content-value' },
            botName
        );
    };

    return LineChannelContent;
}(_react.Component);