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

var _appService = require('../services/app-service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotificationChannelItemComponent = exports.NotificationChannelItemComponent = function (_Component) {
    (0, _inherits3.default)(NotificationChannelItemComponent, _Component);

    function NotificationChannelItemComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, NotificationChannelItemComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onClick = function () {
            (0, _appService.showChannelPage)(_this.props.id);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

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
    hasURL: _react.PropTypes.string,
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