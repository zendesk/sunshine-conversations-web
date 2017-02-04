'use strict';

exports.__esModule = true;
exports.Action = exports.ActionComponent = undefined;

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

var _reactStripeCheckout = require('react-stripe-checkout');

var _reactStripeCheckout2 = _interopRequireDefault(_reactStripeCheckout);

var _reactRedux = require('react-redux');

var _lodash = require('lodash.bindall');

var _lodash2 = _interopRequireDefault(_lodash);

var _stripe = require('../services/stripe');

var _user = require('../services/user');

var _conversation = require('../services/conversation');

var _app = require('../utils/app');

var _loading = require('./loading');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActionComponent = exports.ActionComponent = function (_Component) {
    (0, _inherits3.default)(ActionComponent, _Component);

    function ActionComponent() {
        (0, _classCallCheck3.default)(this, ActionComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        _this.state = {
            state: _this.props.state,
            hasToken: false
        };

        (0, _lodash2.default)(_this, 'onPostbackClick', 'onStripeToken', 'onStripeClick', 'onStripeClose');
        return _this;
    }

    ActionComponent.prototype.onPostbackClick = function onPostbackClick(e) {
        var _this2 = this;

        e.preventDefault();
        var dispatch = this.props.dispatch;


        this.setState({
            state: 'processing'
        });

        dispatch((0, _conversation.postPostback)(this.props._id)).then(function () {
            _this2.setState({
                state: ''
            });
        }).catch(function () {
            _this2.setState({
                state: ''
            });
        });
    };

    ActionComponent.prototype.onStripeToken = function onStripeToken(token) {
        var _this3 = this;

        var _props = this.props,
            user = _props.user,
            dispatch = _props.dispatch;

        this.setState({
            hasToken: true
        });

        var promises = [];
        if (!user.email) {
            promises.push(dispatch((0, _user.immediateUpdate)({
                email: token.email
            })));
        }

        var transactionPromise = dispatch((0, _stripe.createTransaction)(this.props._id, token.id)).then(function () {
            _this3.setState({
                state: 'paid'
            });
        }).catch(function () {
            _this3.setState({
                state: 'offered'
            });
        });

        promises.push(transactionPromise);

        return _promise2.default.all(promises);
    };

    ActionComponent.prototype.onStripeClick = function onStripeClick(e) {
        e.preventDefault();
        this.setState({
            state: 'processing'
        });
    };

    ActionComponent.prototype.onStripeClose = function onStripeClose() {
        if (!this.state.hasToken) {
            this.setState({
                state: 'offered'
            });
        }
    };

    ActionComponent.prototype.render = function render() {
        var _props2 = this.props,
            buttonColor = _props2.buttonColor,
            amount = _props2.amount,
            currency = _props2.currency,
            text = _props2.text,
            uri = _props2.uri,
            type = _props2.type,
            actionPaymentCompletedText = _props2.actionPaymentCompletedText,
            integrations = _props2.integrations,
            stripe = _props2.stripe,
            user = _props2.user;
        var state = this.state.state;


        var stripeIntegration = (0, _app.getIntegration)(integrations, 'stripeConnect');

        var style = {};

        if (buttonColor) {
            style.backgroundColor = style.borderColor = '#' + buttonColor;
        }

        // the public key is necessary to use with Checkout
        // use the link fallback if this happens
        if (type === 'buy' && stripeIntegration) {
            // let's change this when we support other providers
            var stripeAccount = stripe;
            if (state === 'offered') {
                return _react2.default.createElement(
                    _reactStripeCheckout2.default,
                    { componentClass: 'div',
                        className: 'sk-action',
                        token: this.onStripeToken,
                        stripeKey: stripeIntegration.publicKey,
                        email: user.email,
                        amount: amount,
                        currency: currency.toUpperCase(),
                        name: stripeAccount.appName,
                        image: stripeAccount.iconUrl,
                        closed: this.onStripeClose },
                    _react2.default.createElement(
                        'a',
                        { className: 'btn btn-sk-primary',
                            onClick: this.onStripeClick,
                            style: style },
                        text
                    )
                );
            } else {
                var buttonText = state === 'paid' ? actionPaymentCompletedText : _react2.default.createElement(_loading.LoadingComponent, null);

                if (state === 'paid') {
                    style = {};
                }

                return _react2.default.createElement(
                    'div',
                    { className: 'sk-action' },
                    _react2.default.createElement(
                        'div',
                        { className: 'btn btn-sk-action-' + state,
                            style: style },
                        buttonText
                    )
                );
            }
        } else if (type === 'postback') {
            var isProcessing = state === 'processing';
            var _buttonText = isProcessing ? _react2.default.createElement(_loading.LoadingComponent, null) : text;

            return _react2.default.createElement(
                'div',
                { className: 'sk-action' },
                _react2.default.createElement(
                    'a',
                    { className: 'btn btn-sk-primary',
                        style: style,
                        onClick: !isProcessing && this.onPostbackClick },
                    _buttonText
                )
            );
        } else if (type === 'link' || type === 'buy' && !stripeIntegration) {
            var isJavascript = uri.startsWith('javascript:');

            return _react2.default.createElement(
                'div',
                { className: 'sk-action' },
                _react2.default.createElement(
                    'a',
                    { className: 'btn btn-sk-primary',
                        href: uri,
                        target: isJavascript ? '_self' : '_blank',
                        style: style },
                    text
                )
            );
        } else {
            return null;
        }
    };

    return ActionComponent;
}(_react.Component);

ActionComponent.propTypes = {
    text: _react.PropTypes.string.isRequired,
    type: _react.PropTypes.string,
    buttonColor: _react.PropTypes.string,
    amount: _react.PropTypes.number,
    currency: _react.PropTypes.string,
    uri: _react.PropTypes.string,
    state: _react.PropTypes.string,
    actionPaymentCompletedText: _react.PropTypes.string.isRequired,
    integrations: _react.PropTypes.array.isRequired,
    stripe: _react.PropTypes.object,
    user: _react.PropTypes.object.isRequired
};
ActionComponent.defaultProps = {
    type: 'link'
};
var Action = exports.Action = (0, _reactRedux.connect)(function (_ref) {
    var app = _ref.app,
        text = _ref.ui.text,
        user = _ref.user;

    return {
        user: user,
        actionPaymentCompletedText: text.actionPaymentCompleted,
        integrations: app.integrations,
        stripe: app.stripe
    };
}, null, null, {
    withRef: true
})(ActionComponent);