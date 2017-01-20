'use strict';

exports.__esModule = true;
exports.AlternateChannels = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _appService = require('../services/app-service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AlternateChannels = exports.AlternateChannels = function (_Component) {
    (0, _inherits3.default)(AlternateChannels, _Component);

    function AlternateChannels() {
        (0, _classCallCheck3.default)(this, AlternateChannels);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    AlternateChannels.prototype.onChannelClick = function onChannelClick(event) {
        (0, _appService.showChannelPage)(event.target.id);
    };

    AlternateChannels.prototype.render = function render() {
        var _this2 = this;

        var items = this.props.items;


        return _react2.default.createElement(
            'div',
            { className: 'available-channels' },
            _react2.default.createElement(
                'div',
                { className: 'channel-list' },
                items.map(function (_ref) {
                    var channel = _ref.channel,
                        details = _ref.details;

                    return _react2.default.createElement('img', { id: channel.type,
                        className: 'channel-icon',
                        key: channel.type,
                        onClick: _this2.onChannelClick,
                        src: details.icon,
                        alt: details.name,
                        srcSet: details.icon + ' 1x, ' + details.icon2x + ' 2x' });
                })
            )
        );
    };

    return AlternateChannels;
}(_react.Component);

AlternateChannels.propTypes = {
    items: _react.PropTypes.array.isRequired
};