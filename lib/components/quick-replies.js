'use strict';

exports.__esModule = true;
exports.QuickReplies = exports.QuickRepliesComponent = undefined;

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

var _conversation = require('../services/conversation');

var _colors = require('../utils/colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuickRepliesComponent = exports.QuickRepliesComponent = function (_Component) {
    (0, _inherits3.default)(QuickRepliesComponent, _Component);

    function QuickRepliesComponent() {
        (0, _classCallCheck3.default)(this, QuickRepliesComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        (0, _lodash2.default)(_this, 'onReplyClick');
        return _this;
    }

    QuickRepliesComponent.prototype.onReplyClick = function onReplyClick(_ref) {
        var text = _ref.text,
            payload = _ref.payload;
        var dispatch = this.props.dispatch;

        dispatch((0, _conversation.sendMessage)(text, {
            payload: payload
        }));
    };

    QuickRepliesComponent.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            choices = _props.choices,
            accentColor = _props.accentColor,
            isAccentColorDark = _props.isAccentColorDark;


        var buttonStyle = {};

        if (accentColor) {
            var rgb = (0, _colors.getRGB)('#' + accentColor);

            var _rgbToHsl = _colors.rgbToHsl.apply(undefined, rgb),
                h = _rgbToHsl.h;

            buttonStyle.backgroundColor = isAccentColorDark ? 'hsl(' + h + ', 100%, 95%)' : 'hsl(' + h + ', 100%, 98%)';
            buttonStyle.borderColor = '#' + accentColor;
            buttonStyle.color = '#' + accentColor;
        }

        var items = choices.map(function (_ref2, index) {
            var text = _ref2.text,
                payload = _ref2.payload,
                iconUrl = _ref2.iconUrl;

            var onClick = function onClick(e) {
                e.preventDefault();
                _this2.onReplyClick({
                    text: text,
                    payload: payload
                });
            };

            var icon = iconUrl ? _react2.default.createElement('img', { className: 'sk-quick-reply-icon',
                alt: 'Icon',
                src: iconUrl }) : null;

            return _react2.default.createElement(
                'button',
                { className: 'btn btn-sk-quick-reply',
                    style: buttonStyle,
                    onClick: onClick,
                    key: index },
                _react2.default.createElement(
                    'span',
                    null,
                    icon,
                    ' ',
                    text
                )
            );
        });

        return _react2.default.createElement(
            'div',
            { className: 'sk-quick-replies-container' },
            items
        );
    };

    return QuickRepliesComponent;
}(_react.Component);

QuickRepliesComponent.propTypes = {
    accentColor: _react.PropTypes.string,
    isAccentColorDark: _react.PropTypes.bool,
    choices: _react.PropTypes.array.isRequired
};
var QuickReplies = exports.QuickReplies = (0, _reactRedux.connect)(function (_ref3) {
    var app = _ref3.app;

    return {
        accentColor: app.settings.web.accentColor,
        isAccentColorDark: app.settings.web.isAccentColorDark
    };
}, null, null, {
    withRef: true
})(QuickRepliesComponent);