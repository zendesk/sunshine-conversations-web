'use strict';

exports.__esModule = true;
exports.Settings = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _emailSettings = require('./email-settings');

var _notificationsSettings = require('./notifications-settings');

var _app = require('../utils/app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Settings = exports.Settings = function (_Component) {
    (0, _inherits3.default)(Settings, _Component);

    function Settings() {
        (0, _classCallCheck3.default)(this, Settings);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    Settings.prototype.render = function render() {
        var settings = this.context.settings;

        var settingsComponent = (0, _app.hasChannels)(settings) ? _react2.default.createElement(_notificationsSettings.NotificationsSettings, null) : _react2.default.createElement(_emailSettings.EmailSettings, null);

        return _react2.default.createElement(
            'div',
            { className: 'sk-settings' },
            settingsComponent
        );
    };

    return Settings;
}(_react.Component);

Settings.contextTypes = {
    settings: _react.PropTypes.object.isRequired
};
Settings.propTypes = {
    className: _react.PropTypes.string
};