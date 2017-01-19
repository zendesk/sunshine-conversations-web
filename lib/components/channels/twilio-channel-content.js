'use strict';

exports.__esModule = true;
exports.TwilioChannelContent = exports.TwilioChannelContentComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _integrationsService = require('../../services/integrations-service');

var _reactTelephoneInput = require('../../lib/react-telephone-input');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TwilioChannelContentComponent = exports.TwilioChannelContentComponent = function (_Component) {
    (0, _inherits3.default)(TwilioChannelContentComponent, _Component);

    function TwilioChannelContentComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, TwilioChannelContentComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.linkTwilioNumber = function () {
            var appUserNumber = _this.props.channelState.appUserNumber;

            (0, _integrationsService.linkTwilioChannel)(_this.props.smoochId, {
                type: 'twilio',
                phoneNumber: appUserNumber.replace(/[()\-\s]/g, '')
            });
        }, _this.unlinkChannel = function () {
            (0, _integrationsService.unlinkTwilioChannel)(_this.props.smoochId);
        }, _this.handleInputChange = function (telNumber) {
            (0, _integrationsService.updateTwilioAttributes)({
                appUserNumber: telNumber
            });
        }, _this.onStartTexting = function () {
            (0, _integrationsService.updateTwilioAttributes)({
                linkState: 'linked'
            });
        }, _this.onSendText = function () {
            (0, _integrationsService.pingTwilioChannel)(_this.props.smoochId);
        }, _this.onNumberValid = function () {
            (0, _integrationsService.updateTwilioAttributes)({
                appUserNumberValid: true,
                hasError: false
            });
        }, _this.onNumberInvalid = function () {
            (0, _integrationsService.updateTwilioAttributes)({
                appUserNumberValid: false
            });
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    TwilioChannelContentComponent.prototype.componentWillUnmount = function componentWillUnmount() {
        (0, _integrationsService.resetTwilioAttributes)();
    };

    TwilioChannelContentComponent.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            phoneNumber = _props.phoneNumber,
            linkColor = _props.linkColor,
            text = _props.text,
            channelState = _props.channelState;
        var appUserNumber = channelState.appUserNumber,
            appUserNumberValid = channelState.appUserNumberValid,
            errorMessage = channelState.errorMessage,
            hasError = channelState.hasError,
            linkState = channelState.linkState;
        var smsInvalidNumberError = text.smsInvalidNumberError,
            smsLinkPending = text.smsLinkPending,
            smsStartTexting = text.smsStartTexting,
            smsCancel = text.smsCancel,
            smsChangeNumber = text.smsChangeNumber,
            smsSendText = text.smsSendText,
            smsContinue = text.smsContinue;


        var iconStyle = {};
        if (linkColor) {
            iconStyle = {
                color: '#' + linkColor
            };
        }

        var linkButton = appUserNumberValid ? _react2.default.createElement(
            'button',
            { className: 'btn btn-sk-primary',
                onClick: this.linkTwilioNumber },
            smsContinue
        ) : '';

        var onEnterKeyPress = appUserNumberValid ? this.linkTwilioNumber : function () {
            // Do nothing on enter if the number is invalid
        };

        var invalidNumberMessage = appUserNumber && !appUserNumberValid ? smsInvalidNumberError : '';

        var warningMessage = invalidNumberMessage || hasError ? _react2.default.createElement(
            'div',
            { className: 'warning-message' },
            invalidNumberMessage ? invalidNumberMessage : errorMessage
        ) : '';

        var unlinkedComponent = _react2.default.createElement(
            'div',
            { className: 'twilio-linking unlinked-state' },
            _react2.default.createElement(_reactTelephoneInput.ReactTelephoneInput, { ref: function ref(c) {
                    return _this2._telInput = c;
                },
                defaultCountry: 'us',
                onChange: this.handleInputChange,
                onValid: this.onNumberValid,
                onInvalid: this.onNumberInvalid,
                preferredCountries: ['us', 'ca'],
                onEnterKeyPress: onEnterKeyPress,
                onBlur: this.handleInputBlur }),
            warningMessage,
            linkButton
        );

        var pendingComponent = _react2.default.createElement(
            'div',
            { className: 'twilio-linking pending-state' },
            _react2.default.createElement('i', { className: 'fa fa-phone',
                style: iconStyle }),
            _react2.default.createElement(
                'span',
                { className: 'phone-number' },
                appUserNumber,
                ' - ',
                smsLinkPending
            ),
            _react2.default.createElement(
                'a',
                { onClick: this.unlinkChannel },
                smsCancel
            )
        );

        var sendTextUrl = 'sms://' + phoneNumber;
        var linkStyle = {
            color: 'white'
        };
        var linkedComponentButton = _ismobilejs2.default.phone ? _react2.default.createElement(
            'a',
            { href: sendTextUrl,
                className: 'btn btn-sk-primary twilio-linking',
                onClick: this.onStartTexting,
                style: linkStyle },
            smsStartTexting
        ) : _react2.default.createElement(
            'button',
            { className: 'btn btn-sk-primary twilio-linking',
                onClick: this.onSendText },
            smsSendText
        );

        var linkedComponent = _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'div',
                { className: 'twilio-linking linked-state' },
                _react2.default.createElement('i', { className: 'fa fa-phone',
                    style: iconStyle }),
                _react2.default.createElement(
                    'span',
                    { className: 'phone-number' },
                    appUserNumber
                ),
                _react2.default.createElement(
                    'a',
                    { onClick: this.unlinkChannel },
                    smsChangeNumber
                )
            ),
            linkedComponentButton
        );
        if (linkState === 'pending') {
            return pendingComponent;
        } else if (linkState === 'linked') {
            return linkedComponent;
        } else {
            return unlinkedComponent;
        }
    };

    return TwilioChannelContentComponent;
}(_react.Component);

TwilioChannelContentComponent.propTypes = {
    linkColor: _react.PropTypes.string,
    phoneNumber: _react.PropTypes.string.isRequired,
    linkState: _react.PropTypes.oneOf(['unlinked', 'pending', 'linked']),
    smoochId: _react.PropTypes.string.isRequired,
    text: _react.PropTypes.object.isRequired,
    channelState: _react.PropTypes.object.isRequired
};
var TwilioChannelContent = exports.TwilioChannelContent = (0, _reactRedux.connect)(function (_ref) {
    var app = _ref.app,
        text = _ref.ui.text;

    return {
        linkColor: app.settings.web.linkColor,
        text: {
            smsInvalidNumberError: text.smsInvalidNumberError,
            smsLinkPending: text.smsLinkPending,
            smsStartTexting: text.smsStartTexting,
            smsCancel: text.smsCancel,
            smsChangeNumber: text.smsChangeNumber,
            smsSendText: text.smsSendText,
            smsContinue: text.smsContinue
        }
    };
})(TwilioChannelContentComponent);