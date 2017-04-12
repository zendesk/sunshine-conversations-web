'use strict';

exports.__esModule = true;
exports.AlternateChannels = exports.AlternateChannelsComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _lodash = require('lodash.bindall');

var _lodash2 = _interopRequireDefault(_lodash);

var _app = require('../services/app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AlternateChannelsComponent = exports.AlternateChannelsComponent = function (_Component) {
    (0, _inherits3.default)(AlternateChannelsComponent, _Component);

    function AlternateChannelsComponent() {
        (0, _classCallCheck3.default)(this, AlternateChannelsComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        (0, _lodash2.default)(_this, 'onChannelClick');
        return _this;
    }

    AlternateChannelsComponent.prototype.onChannelClick = function onChannelClick(e) {
        e.preventDefault();
        var dispatch = this.props.dispatch;

        dispatch((0, _app.showChannelPage)(e.target.id));
    };

    AlternateChannelsComponent.prototype.render = function render() {
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

    return AlternateChannelsComponent;
}(_react.Component);

AlternateChannelsComponent.propTypes = {
    items: _react.PropTypes.array.isRequired
};
var AlternateChannels = exports.AlternateChannels = (0, _reactRedux.connect)()(AlternateChannelsComponent);