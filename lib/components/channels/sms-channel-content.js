'use strict';

exports.__esModule = true;
exports.SMSChannelContent = exports.SMSChannelContentComponent = undefined;

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

var _integrations = require('../../services/integrations');

var _reactTelephoneInput = require('../../lib/react-telephone-input');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SMSChannelContentComponent = exports.SMSChannelContentComponent = function (_Component) {
    (0, _inherits3.default)(SMSChannelContentComponent, _Component);

    function SMSChannelContentComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, SMSChannelContentComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.linkPhoneNumber = function () {
            var _this$props = _this.props,
                dispatch = _this$props.dispatch,
                appUserNumber = _this$props.channelState.appUserNumber,
                type = _this$props.type;

            dispatch((0, _integrations.linkSMSChannel)(_this.props.smoochId, {
                type: type,
                phoneNumber: appUserNumber.replace(/[()\-\s]/g, '')
            }));
        }, _this.unlinkChannel = function () {
            var _this$props2 = _this.props,
                dispatch = _this$props2.dispatch,
                type = _this$props2.type;

            dispatch((0, _integrations.unlinkSMSChannel)(_this.props.smoochId, type));
        }, _this.handleInputChange = function (telNumber) {
            var _this$props3 = _this.props,
                dispatch = _this$props3.dispatch,
                type = _this$props3.type;

            dispatch((0, _integrations.updateSMSAttributes)({
                appUserNumber: telNumber
            }, type));
        }, _this.onStartTexting = function () {
            var _this$props4 = _this.props,
                dispatch = _this$props4.dispatch,
                type = _this$props4.type;

            dispatch((0, _integrations.updateSMSAttributes)({
                linkState: 'linked'
            }, type));
        }, _this.onSendText = function () {
            var _this$props5 = _this.props,
                dispatch = _this$props5.dispatch,
                type = _this$props5.type;

            dispatch((0, _integrations.pingSMSChannel)(_this.props.smoochId, type));
        }, _this.onNumberValid = function () {
            var _this$props6 = _this.props,
                dispatch = _this$props6.dispatch,
                type = _this$props6.type;

            dispatch((0, _integrations.updateSMSAttributes)({
                appUserNumberValid: true,
                hasError: false
            }, type));
        }, _this.onNumberInvalid = function () {
            var _this$props7 = _this.props,
                dispatch = _this$props7.dispatch,
                type = _this$props7.type;

            dispatch((0, _integrations.updateSMSAttributes)({
                appUserNumberValid: false
            }, type));
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    SMSChannelContentComponent.prototype.componentWillUnmount = function componentWillUnmount() {
        var _props = this.props,
            dispatch = _props.dispatch,
            type = _props.type;

        dispatch((0, _integrations.resetSMSAttributes)(type));
    };

    SMSChannelContentComponent.prototype.render = function render() {
        var _this2 = this;

        var _props2 = this.props,
            originator = _props2.originator,
            phoneNumber = _props2.phoneNumber,
            linkColor = _props2.linkColor,
            text = _props2.text,
            channelState = _props2.channelState,
            type = _props2.type;
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
                onClick: this.linkPhoneNumber },
            smsContinue
        ) : '';

        var onEnterKeyPress = appUserNumberValid ? this.linkPhoneNumber : function () {
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
            { className: 'sms-linking unlinked-state' },
            _react2.default.createElement(_reactTelephoneInput.ReactTelephoneInput, { ref: function ref(c) {
                    return _this2._telInput = c;
                },
                defaultCountry: 'us',
                isValid: false,
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
            { className: 'sms-linking pending-state' },
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

        var sendTextUrl = 'sms://' + (phoneNumber || originator);
        var linkStyle = {
            color: 'white'
        };
        var linkedComponentButton = _ismobilejs2.default.phone ? _react2.default.createElement(
            'a',
            { href: sendTextUrl,
                className: 'btn btn-sk-primary sms-linking',
                onClick: this.onStartTexting,
                style: linkStyle },
            smsStartTexting
        ) : _react2.default.createElement(
            'button',
            { className: 'btn btn-sk-primary sms-linking',
                onClick: this.onSendText },
            smsSendText
        );

        var linkedComponent = _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'div',
                { className: 'sms-linking linked-state' },
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

    return SMSChannelContentComponent;
}(_react.Component);

SMSChannelContentComponent.propTypes = {
    linkColor: _react.PropTypes.string,
    phoneNumber: _react.PropTypes.string,
    originator: _react.PropTypes.string,
    linkState: _react.PropTypes.oneOf(['unlinked', 'pending', 'linked']),
    smoochId: _react.PropTypes.string.isRequired,
    text: _react.PropTypes.object.isRequired,
    channelState: _react.PropTypes.object.isRequired,
    type: _react.PropTypes.oneOf(['twilio', 'messagebird'])
};
var SMSChannelContent = exports.SMSChannelContent = (0, _reactRedux.connect)(function (_ref) {
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
})(SMSChannelContentComponent);