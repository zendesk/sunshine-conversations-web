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

var _user = require('../services/user');

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
            var _this$props$actions = _this.props.actions,
                immediateUpdate = _this$props$actions.immediateUpdate,
                hideSettings = _this$props$actions.hideSettings;

            // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript

            var regex = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

            var email = _this.state.email;

            var isValid = regex.test(email);

            if (isValid) {
                return immediateUpdate({
                    email: email
                }).then(function () {
                    hideSettings();
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
        var _props = this.props,
            appState = _props.appState,
            user = _props.user,
            linkColor = _props.linkColor,
            text = _props.text;


        var style = {};

        if (linkColor) {
            style.backgroundColor = style.borderColor = '#' + linkColor;
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

EmailSettingsComponent.propTypes = {
    text: _react.PropTypes.object.isRequired,
    appState: _react.PropTypes.object.isRequired,
    user: _react.PropTypes.object.isRequired,
    linkColor: _react.PropTypes.string
};
var EmailSettings = exports.EmailSettings = (0, _reactRedux.connect)(function (_ref) {
    var readOnlyEmail = _ref.appState.readOnlyEmail,
        user = _ref.user,
        text = _ref.ui.text,
        app = _ref.app;

    return {
        appState: {
            readOnlyEmail: readOnlyEmail
        },
        user: user,
        linkColor: app.settings.web.linkColor,
        text: {
            settingsInputPlaceholder: text.settingsInputPlaceholder,
            settingsReadOnlyText: text.settingsReadOnlyText,
            settingsSaveButtonText: text.settingsSaveButtonText,
            settingsText: text.settingsText
        }
    };
}, function (dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)({
            hideSettings: _appStateActions.hideSettings,
            immediateUpdate: _user.immediateUpdate
        }, dispatch)
    };
}, null, {
    withRef: true
})(EmailSettingsComponent);