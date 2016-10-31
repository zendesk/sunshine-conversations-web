'use strict';

exports.__esModule = true;
exports.ErrorNotification = exports.ErrorNotificationComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _html = require('../utils/html');

var _events = require('../utils/events');

var _appStateActions = require('../actions/app-state-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorNotificationComponent = exports.ErrorNotificationComponent = function (_Component) {
    (0, _inherits3.default)(ErrorNotificationComponent, _Component);

    function ErrorNotificationComponent() {
        (0, _classCallCheck3.default)(this, ErrorNotificationComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    ErrorNotificationComponent.prototype.render = function render() {
        var linkStyle = {
            cursor: 'pointer'
        };

        var message = this.props.message;

        var classes = ['sk-notification', 'sk-notification-error', message && message.length > 50 && 'long-text'].filter(function (value) {
            return value;
        }).join(' ');

        return _react2.default.createElement(
            'div',
            { key: 'content',
                className: classes,
                onClick: this.props.actions.hideErrorNotification },
            _react2.default.createElement(
                'p',
                null,
                _react2.default.createElement('span', { ref: 'text',
                    dangerouslySetInnerHTML: (0, _html.createMarkup)(message) }),
                _react2.default.createElement(
                    'a',
                    { style: linkStyle,
                        onClick: _events.preventDefault,
                        className: 'sk-notification-close' },
                    '\xD7'
                )
            )
        );
    };

    return ErrorNotificationComponent;
}(_react.Component);

var ErrorNotification = exports.ErrorNotification = (0, _reactRedux.connect)(undefined, function (dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)({
            hideErrorNotification: _appStateActions.hideErrorNotification
        }, dispatch)
    };
})(ErrorNotificationComponent);