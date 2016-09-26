'use strict';

exports.__esModule = true;
exports.ChannelPage = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChannelPage = exports.ChannelPage = function (_Component) {
    (0, _inherits3.default)(ChannelPage, _Component);

    function ChannelPage() {
        (0, _classCallCheck3.default)(this, ChannelPage);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    ChannelPage.prototype.render = function render() {
        var _props = this.props;
        var icon = _props.icon;
        var icon2x = _props.icon2x;
        var name = _props.name;
        var visible = _props.visible;
        var children = _props.children;
        var channel = _props.channel;
        var client = _props.client;
        var pendingClient = _props.pendingClient;


        var description = this.props.getDescription ? this.props.getDescription({
            text: this.context.ui.text,
            channel: channel,
            client: client,
            pendingClient: pendingClient
        }) : this.context.ui.text[this.props.descriptionKey];

        var descriptionHtml = this.context.ui.text[this.props.descriptionHtmlKey];

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

    return ChannelPage;
}(_react.Component);

ChannelPage.propTypes = {
    name: _react.PropTypes.string.isRequired,
    description: _react.PropTypes.string,
    descriptionHtml: _react.PropTypes.string,
    visible: _react.PropTypes.bool,
    icon: _react.PropTypes.string.isRequired,
    icon2x: _react.PropTypes.string.isRequired,
    children: _react.PropTypes.element.isRequired
};
ChannelPage.contextTypes = {
    ui: _react.PropTypes.object.isRequired
};
ChannelPage.defaultProps = {
    visible: false
};