'use strict';

exports.__esModule = true;
exports.MessengerButton = exports.MessengerButtonComponent = exports.DefaultButtonIcon = undefined;

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

var _styles = require('../constants/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultButtonIcon = exports.DefaultButtonIcon = function (_Component) {
    (0, _inherits3.default)(DefaultButtonIcon, _Component);

    function DefaultButtonIcon() {
        (0, _classCallCheck3.default)(this, DefaultButtonIcon);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    DefaultButtonIcon.prototype.render = function render() {
        var isBrandColorDark = this.props.isBrandColorDark;
        var _window$location = window.location,
            protocol = _window$location.protocol,
            host = _window$location.host,
            pathname = _window$location.pathname,
            search = _window$location.search;


        return _react2.default.createElement(
            'svg',
            { version: '1.0',
                x: '0px',
                y: '0px',
                viewBox: '0 0 100 100',
                className: 'default-icon',
                style: { enableBackground: 'new 0 0 100 100', overflow: 'visible', shapeRendering: 'geometricPrecision' } },
            _react2.default.createElement(
                'filter',
                { id: 'dropShadow' },
                _react2.default.createElement('feGaussianBlur', { stdDeviation: '0,4',
                    'in': 'SourceAlpha' }),
                _react2.default.createElement('feOffset', { dx: '0',
                    dy: '4',
                    result: 'offsetblur' }),
                _react2.default.createElement(
                    'feComponentTransfer',
                    null,
                    _react2.default.createElement('feFuncA', { type: 'linear',
                        slope: '0.4' })
                ),
                _react2.default.createElement('feComposite', { operator: 'in',
                    in2: 'offsetblur' }),
                _react2.default.createElement(
                    'feMerge',
                    null,
                    _react2.default.createElement('feMergeNode', null),
                    _react2.default.createElement('feMergeNode', { 'in': 'SourceGraphic' })
                )
            ),
            _react2.default.createElement('path', { fill: isBrandColorDark ? '#fff' : _styles.SK_DARK_CONTRAST,
                filter: 'url(' + protocol + '//' + host + pathname + search + '#dropShadow)',
                d: 'M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50h30.8l0-10.6C92.5,80.2,100,66,100,50C100,22.4,77.6,0,50,0z M32,54.5 c-2.5,0-4.5-2-4.5-4.5c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5C36.5,52.5,34.5,54.5,32,54.5z M50,54.5c-2.5,0-4.5-2-4.5-4.5 c0-2.5,2-4.5,4.5-4.5c2.5,0,4.5,2,4.5,4.5C54.5,52.5,52.5,54.5,50,54.5z M68,54.5c-2.5,0-4.5-2-4.5-4.5c0-2.5,2-4.5,4.5-4.5 s4.5,2,4.5,4.5C72.5,52.5,70.5,54.5,68,54.5z' })
        );
    };

    return DefaultButtonIcon;
}(_react.Component);

var MessengerButtonComponent = exports.MessengerButtonComponent = function (_Component2) {
    (0, _inherits3.default)(MessengerButtonComponent, _Component2);

    function MessengerButtonComponent() {
        (0, _classCallCheck3.default)(this, MessengerButtonComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this2 = (0, _possibleConstructorReturn3.default)(this, _Component2.call.apply(_Component2, [this].concat(args)));

        (0, _lodash2.default)(_this2, 'onClick');
        return _this2;
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
            content = _react2.default.createElement(DefaultButtonIcon, { isBrandColorDark: isBrandColorDark,
                brandColor: brandColor });
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