'use strict';

exports.__esModule = true;
exports.ChannelPage = exports.ChannelPageComponent = undefined;

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

var ChannelPageComponent = exports.ChannelPageComponent = function (_Component) {
    (0, _inherits3.default)(ChannelPageComponent, _Component);

    function ChannelPageComponent() {
        (0, _classCallCheck3.default)(this, ChannelPageComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    ChannelPageComponent.prototype.render = function render() {
        var _props = this.props,
            icon = _props.icon,
            icon2x = _props.icon2x,
            name = _props.name,
            visible = _props.visible,
            children = _props.children,
            channel = _props.channel,
            client = _props.client,
            pendingClient = _props.pendingClient,
            text = _props.text;


        var description = this.props.getDescription ? this.props.getDescription({
            text: text,
            channel: channel,
            client: client,
            pendingClient: pendingClient
        }) : text[this.props.descriptionKey];

        var descriptionHtml = text[this.props.descriptionHtmlKey];

        var channelDescription = descriptionHtml ? _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: descriptionHtml } }) : _react2.default.createElement(
            'span',
            null,
            description
        );

        return _react2.default.createElement(
            'div',
            { className: 'sk-channel ' + (visible ? 'sk-channel-visible' : 'sk-channel-hidden') },
            _react2.default.createElement(
                'div',
                { className: 'content-wrapper' },
                _react2.default.createElement(
                    'div',
                    { className: 'channel-header' },
                    _react2.default.createElement('img', { className: 'channel-icon',
                        alt: name,
                        src: icon,
                        srcSet: icon + ' 1x, ' + icon2x + ' 2x' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'channel-name' },
                        name
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'channel-description' },
                        channelDescription
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'channel-content' },
                    children
                )
            )
        );
    };

    return ChannelPageComponent;
}(_react.Component);

ChannelPageComponent.propTypes = {
    name: _react.PropTypes.string.isRequired,
    description: _react.PropTypes.string,
    descriptionHtml: _react.PropTypes.string,
    visible: _react.PropTypes.bool,
    icon: _react.PropTypes.string.isRequired,
    icon2x: _react.PropTypes.string.isRequired,
    children: _react.PropTypes.element.isRequired,
    text: _react.PropTypes.object.isRequired
};
ChannelPageComponent.defaultProps = {
    visible: false
};
var ChannelPage = exports.ChannelPage = (0, _reactRedux.connect)(function (_ref) {
    var text = _ref.ui.text;

    return {
        text: text
    };
})(ChannelPageComponent);