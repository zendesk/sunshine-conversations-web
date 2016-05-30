'use strict';

exports.__esModule = true;
exports.Settings = exports.SettingsComponent = undefined;

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

var SettingsComponent = exports.SettingsComponent = function (_Component) {
    (0, _inherits3.default)(SettingsComponent, _Component);

    function SettingsComponent(props) {
        (0, _classCallCheck3.default)(this, SettingsComponent);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.state = {
            email: _this.props.user.email,
            hasError: false
        };

        _this.onChange = _this.onChange.bind(_this);
        _this.save = _this.save.bind(_this);
        return _this;
    }

    SettingsComponent.prototype.onChange = function onChange(e) {
        this.setState({
            email: e.target.value,
            hasError: false
        });
    };

    SettingsComponent.prototype.save = function save(e) {
        var _this2 = this;

        e.preventDefault();

        // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var regex = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        var email = this.state.email;

        var isValid = regex.test(email);

        if (isValid) {
            return (0, _userService.immediateUpdate)({
                email: email
            }).then(function () {
                _this2.props.actions.hideSettings();
            });
        } else {
            return _promise2.default.resolve().then(function () {
                _this2.setState({
                    hasError: true
                });
            });
        }
    };

    SettingsComponent.prototype.render = function render() {
        var hasError = this.state.hasError;

        var style = {};

        if (this.props.settings.linkColor) {
            style.backgroundColor = style.borderColor = '#' + this.props.settings.linkColor;
        }

        var button = this.props.appState.readOnlyEmail ? null : _react2.default.createElement(
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
                this.props.ui.text.settingsSaveButtonText
            )
        );

        return _react2.default.createElement(
            'div',
            { className: 'sk-settings' },
            _react2.default.createElement(
                'div',
                { className: 'settings-wrapper' },
                _react2.default.createElement(
                    'p',
                    { ref: 'description' },
                    this.props.appState.readOnlyEmail ? this.props.ui.text.settingsReadOnlyText : this.props.ui.text.settingsText
                ),
                _react2.default.createElement(
                    'form',
                    { onSubmit: this.save },
                    _react2.default.createElement(
                        'div',
                        { className: hasError ? 'input-group has-error' : 'input-group' },
                        _react2.default.createElement('i', { className: 'fa fa-envelope-o before-icon' }),
                        _react2.default.createElement('input', { disabled: this.props.appState.readOnlyEmail,
                            ref: 'input',
                            type: 'email',
                            placeholder: this.props.ui.text.settingsInputPlaceholder,
                            className: 'input email-input',
                            onChange: this.onChange,
                            defaultValue: this.props.user.email })
                    ),
                    button
                )
            )
        );
    };

    return SettingsComponent;
}(_react.Component);

SettingsComponent.defaultProps = {
    settings: {}
};
var Settings = exports.Settings = (0, _reactRedux.connect)(function (state) {
    return {
        ui: state.ui,
        appState: state.appState,
        user: state.user,
        settings: state.app.settings && state.app.settings.web
    };
}, function (dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)({
            hideSettings: _appStateActions.hideSettings
        }, dispatch)
    };
})(SettingsComponent);