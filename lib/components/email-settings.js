'use strict';

exports.__esModule = true;
exports.EmailSettings = exports.EmailSettingsComponent = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _userService = require('../services/user-service');

var _appStateActions = require('../actions/app-state-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EmailSettingsComponent = exports.EmailSettingsComponent = function (_Component) {
    (0, _inherits3.default)(EmailSettingsComponent, _Component);

    function EmailSettingsComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, EmailSettingsComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
            email: _this.props.user.email,
            hasError: false
        }, _this.onChange = function (e) {
            _this.setState({
                email: e.target.value,
                hasError: false
            });
        }, _this.save = function (e) {
            e.preventDefault();

            // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
            var regex = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

            var email = _this.state.email;

            var isValid = regex.test(email);

            if (isValid) {
                return (0, _userService.immediateUpdate)({
                    email: email
                }).then(function () {
                    _this.props.actions.hideSettings();
                });
            } else {
                return _promise2.default.resolve().then(function () {
                    _this.setState({
                        hasError: true
                    });
                });
            }
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    EmailSettingsComponent.prototype.render = function render() {
        var hasError = this.state.hasError;
        var _context = this.context;
        var settings = _context.settings;
        var text = _context.ui.text;
        var _props = this.props;
        var appState = _props.appState;
        var user = _props.user;


        var style = {};

        if (settings.linkColor) {
            style.backgroundColor = style.borderColor = '#' + settings.linkColor;
        }

        var button = appState.readOnlyEmail ? null : _react2.default.createElement(
            'div',
            { className: 'input-group' },
            _react2.default.createElement(
                'button',
                { ref: 'button',
                    disabled: hasError,
                    type: 'button',
                    className: 'btn btn-sk-primary',
                    style: style,
                    onClick: this.save },
                text.settingsSaveButtonText
            )
        );

        return _react2.default.createElement(
            'div',
            { className: 'settings-wrapper content-wrapper' },
            _react2.default.createElement(
                'p',
                { ref: 'description' },
                appState.readOnlyEmail ? text.settingsReadOnlyText : text.settingsText
            ),
            _react2.default.createElement(
                'form',
                { onSubmit: this.save },
                _react2.default.createElement(
                    'div',
                    { className: hasError ? 'input-group has-error' : 'input-group' },
                    _react2.default.createElement('i', { className: 'fa fa-envelope-o before-icon' }),
                    _react2.default.createElement('input', { disabled: appState.readOnlyEmail,
                        ref: 'input',
                        type: 'email',
                        placeholder: text.settingsInputPlaceholder,
                        className: 'input email-input',
                        onChange: this.onChange,
                        defaultValue: user.email })
                ),
                button
            )
        );
    };

    return EmailSettingsComponent;
}(_react.Component);

EmailSettingsComponent.contextTypes = {
    ui: _react.PropTypes.object.isRequired,
    settings: _react.PropTypes.object.isRequired
};
EmailSettingsComponent.defaultProps = {
    settings: {}
};
var EmailSettings = exports.EmailSettings = (0, _reactRedux.connect)(function (state) {
    return {
        appState: state.appState,
        user: state.user
    };
}, function (dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)({
            hideSettings: _appStateActions.hideSettings
        }, dispatch)
    };
})(EmailSettingsComponent);