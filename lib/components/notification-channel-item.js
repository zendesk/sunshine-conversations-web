'use strict';

exports.__esModule = true;
exports.NotificationChannelItem = exports.NotificationChannelItemComponent = undefined;

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

var NotificationChannelItemComponent = exports.NotificationChannelItemComponent = function (_Component) {
    (0, _inherits3.default)(NotificationChannelItemComponent, _Component);

    function NotificationChannelItemComponent() {
        (0, _classCallCheck3.default)(this, NotificationChannelItemComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        (0, _lodash2.default)(_this, 'onClick');
        return _this;
    }

    NotificationChannelItemComponent.prototype.onClick = function onClick() {
        var dispatch = this.props.dispatch;

        dispatch((0, _app.showChannelPage)(this.props.id));
    };

    NotificationChannelItemComponent.prototype.render = function render() {
        var _props = this.props,
            name = _props.name,
            icon = _props.icon,
            icon2x = _props.icon2x,
            linked = _props.linked,
            hasURL = _props.hasURL,
            displayName = _props.displayName,
            linkColor = _props.linkColor,
            notificationSettingsConnectedText = _props.notificationSettingsConnectedText,
            notificationSettingsConnectedAsText = _props.notificationSettingsConnectedAsText;


        var itemRightStyle = linked && linkColor ? {
            color: '#' + linkColor
        } : null;

        var classNames = ['channel-item'];
        var contentClassNames = ['channel-item-content'];

        if (linked) {
            classNames.push('channel-item-linked');
            contentClassNames.push('linked');
        }

        return _react2.default.createElement(
            'div',
            { className: classNames.join(' '),
                onClick: this.onClick },
            _react2.default.createElement(
                'div',
                { className: 'channel-item-header' },
                _react2.default.createElement('img', { className: 'channel-item-icon',
                    alt: name,
                    src: icon,
                    srcSet: icon + ' 1x, ' + icon2x + ' 2x' }),
                _react2.default.createElement(
                    'div',
                    { className: contentClassNames.join(' ') },
                    _react2.default.createElement(
                        'div',
                        { className: 'channel-item-name' },
                        name
                    ),
                    linked ? _react2.default.createElement(
                        'div',
                        { className: 'channel-item-connected-as' },
                        displayName ? notificationSettingsConnectedAsText.replace('{username}', displayName) : notificationSettingsConnectedText
                    ) : null
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'channel-item-right',
                        style: itemRightStyle },
                    hasURL && linked ? 'Open' : _react2.default.createElement('i', { className: 'fa fa-angle-right' })
                )
            )
        );
    };

    return NotificationChannelItemComponent;
}(_react.Component);

NotificationChannelItemComponent.propTypes = {
    id: _react.PropTypes.string.isRequired,
    name: _react.PropTypes.string.isRequired,
    linked: _react.PropTypes.bool.isRequired,
    hasURL: _react.PropTypes.bool,
    icon: _react.PropTypes.string.isRequired,
    icon2x: _react.PropTypes.string.isRequired,
    displayName: _react.PropTypes.string,
    linkColor: _react.PropTypes.string,
    notificationSettingsConnectedAsText: _react.PropTypes.string.isRequired,
    notificationSettingsConnectedText: _react.PropTypes.string.isRequired
};
var NotificationChannelItem = exports.NotificationChannelItem = (0, _reactRedux.connect)(function (_ref) {
    var app = _ref.app,
        ui = _ref.ui;

    return {
        linkColor: app.settings.web.linkColor,
        notificationSettingsConnectedAsText: ui.text.notificationSettingsConnectedAs,
        notificationSettingsConnectedText: ui.text.notificationSettingsConnected
    };
})(NotificationChannelItemComponent);