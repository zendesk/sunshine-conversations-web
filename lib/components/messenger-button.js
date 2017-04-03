'use strict';

exports.__esModule = true;
exports.MessengerButton = exports.MessengerButtonComponent = undefined;

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

var _defaultButtonIcon = require('./default-button-icon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessengerButtonComponent = exports.MessengerButtonComponent = function (_Component) {
    (0, _inherits3.default)(MessengerButtonComponent, _Component);

    function MessengerButtonComponent() {
        (0, _classCallCheck3.default)(this, MessengerButtonComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        (0, _lodash2.default)(_this, 'onClick');
        return _this;
    }

    MessengerButtonComponent.prototype.onClick = function onClick(e) {
        var dispatch = this.props.dispatch;

        e.preventDefault();
        dispatch((0, _app.openWidget)());
    };

    MessengerButtonComponent.prototype.render = function render() {
        var _props = this.props,
            unreadCount = _props.unreadCount,
            shown = _props.shown,
            settings = _props.settings;
        var brandColor = settings.brandColor,
            isBrandColorDark = settings.isBrandColorDark,
            buttonIconUrl = settings.buttonIconUrl;


        var style = {
            backgroundColor: '#' + brandColor
        };

        var content = void 0;

        if (buttonIconUrl) {
            content = _react2.default.createElement(
                'div',
                { className: 'messenger-button-icon' },
                _react2.default.createElement('img', { alt: 'Smooch Messenger Button',
                    src: buttonIconUrl })
            );
        } else {
            content = _react2.default.createElement(_defaultButtonIcon.DefaultButtonIcon, { isBrandColorDark: isBrandColorDark });
        }

        var unreadBadge = void 0;
        if (unreadCount > 0) {
            unreadBadge = _react2.default.createElement(
                'div',
                { className: 'unread-badge' },
                unreadCount
            );
        }

        return _react2.default.createElement(
            'div',
            { id: 'sk-messenger-button',
                className: 'messenger-button-' + (shown ? 'shown' : 'hidden'),
                style: style,
                onClick: this.onClick },
            content,
            unreadBadge
        );
    };

    return MessengerButtonComponent;
}(_react.Component);

MessengerButtonComponent.propTypes = {
    shown: _react.PropTypes.bool.isRequired,
    unreadCount: _react.PropTypes.number.isRequired,
    settings: _react.PropTypes.object.isRequired
};
MessengerButtonComponent.defaultProps = {
    shown: true,
    unreadCount: 0
};
var MessengerButton = exports.MessengerButton = (0, _reactRedux.connect)(function (_ref) {
    var app = _ref.app,
        unreadCount = _ref.conversation.unreadCount;

    return {
        settings: app.settings.web,
        unreadCount: unreadCount
    };
})(MessengerButtonComponent);