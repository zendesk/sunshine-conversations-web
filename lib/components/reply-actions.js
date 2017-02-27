'use strict';

exports.__esModule = true;
exports.ReplyActions = exports.ReplyActionsComponent = undefined;

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

var _locationIcon = require('./location-icon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReplyActionsComponent = exports.ReplyActionsComponent = function (_Component) {
    (0, _inherits3.default)(ReplyActionsComponent, _Component);

    function ReplyActionsComponent() {
        (0, _classCallCheck3.default)(this, ReplyActionsComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        (0, _lodash2.default)(_this, 'onReplyClick');

        _this.state = {};
        return _this;
    }

    ReplyActionsComponent.prototype.onReplyClick = function onReplyClick(_ref) {
        var text = _ref.text,
            payload = _ref.payload,
            metadata = _ref.metadata;
        var dispatch = this.props.dispatch;

        dispatch((0, _conversation.sendMessage)({
            text: text,
            payload: payload,
            metadata: metadata
        }));
    };

    ReplyActionsComponent.prototype.onSendLocation = function onSendLocation(data) {
        var _props = this.props,
            dispatch = _props.dispatch,
            locationNotSupportedText = _props.locationNotSupportedText;


        if ('geolocation' in navigator) {
            dispatch((0, _conversation.sendLocation)(data));
        } else {
            alert(locationNotSupportedText);
        }
    };

    ReplyActionsComponent.prototype.render = function render() {
        var _this2 = this;

        var _props2 = this.props,
            choices = _props2.choices,
            accentColor = _props2.accentColor,
            isAccentColorDark = _props2.isAccentColorDark;

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
                iconUrl = _ref2.iconUrl,
                type = _ref2.type,
                payload = _ref2.payload,
                metadata = _ref2.metadata;

            var isLocationRequest = type === 'locationRequest';

            var onClick = function onClick(e) {
                e.preventDefault();

                if (isLocationRequest) {
                    _this2.onSendLocation({
                        metadata: metadata
                    });
                } else {
                    _this2.onReplyClick({
                        text: text,
                        payload: payload,
                        metadata: metadata
                    });
                }
            };

            var locationIcon = _react2.default.createElement(_locationIcon.Location, null);
            var imageIcon = _react2.default.createElement('img', { className: 'sk-reply-action-icon',
                alt: 'Icon',
                src: iconUrl });

            var icon = isLocationRequest ? locationIcon : iconUrl ? imageIcon : null;

            return _react2.default.createElement(
                'button',
                { className: 'btn btn-sk-reply-action',
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
            { className: 'sk-reply-actions-container' },
            items
        );
    };

    return ReplyActionsComponent;
}(_react.Component);

ReplyActionsComponent.propTypes = {
    accentColor: _react.PropTypes.string,
    isAccentColorDark: _react.PropTypes.bool,
    choices: _react.PropTypes.array.isRequired,
    locationNotSupportedText: _react.PropTypes.string.isRequired
};
var ReplyActions = exports.ReplyActions = (0, _reactRedux.connect)(function (_ref3) {
    var app = _ref3.app,
        ui = _ref3.ui;

    return {
        accentColor: app.settings.web.accentColor,
        isAccentColorDark: app.settings.web.isAccentColorDark,
        locationNotSupportedText: ui.text.locationNotSupported
    };
}, null, null, {
    withRef: true
})(ReplyActionsComponent);