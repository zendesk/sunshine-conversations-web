'use strict';

exports.__esModule = true;
exports.Notification = exports.NotificationComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _html = require('../utils/html');

var _appStateActions = require('../actions/app-state-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotificationComponent = exports.NotificationComponent = function (_Component) {
    (0, _inherits3.default)(NotificationComponent, _Component);

    function NotificationComponent() {
        (0, _classCallCheck3.default)(this, NotificationComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    NotificationComponent.prototype.bindHandler = function bindHandler() {
        var node = (0, _reactDom.findDOMNode)(this);
        var linkNode = node.querySelector('[data-ui-settings-link]');
        if (linkNode) {
            linkNode.onclick = this.onLinkClick.bind(this);

            if (this.props.settings.linkColor) {
                linkNode.style = 'color: #' + this.props.settings.linkColor;
            }
        }
    };

    NotificationComponent.prototype.componentDidMount = function componentDidMount() {
        this.bindHandler();
    };

    NotificationComponent.prototype.componentDidUpdate = function componentDidUpdate() {
        this.bindHandler();
    };

    NotificationComponent.prototype.onLinkClick = function onLinkClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.actions.hideSettingsNotification();
        this.props.actions.showSettings();
    };

    NotificationComponent.prototype.render = function render() {
        var linkStyle = {
            cursor: 'pointer'
        };
        return _react2.default.createElement(
            'div',
            { key: 'content',
                className: 'sk-notification',
                onClick: this.props.actions.hideSettingsNotification },
            _react2.default.createElement(
                'p',
                null,
                _react2.default.createElement('span', { ref: 'text',
                    dangerouslySetInnerHTML: (0, _html.createMarkup)(this.props.ui.text.settingsNotificationText) }),
                _react2.default.createElement(
                    'a',
                    { style: linkStyle,
                        className: 'sk-notification-close',
                        onClick: this.props.actions.hideSettingsNotification },
                    '×'
                )
            )
        );
    };

    return NotificationComponent;
}(_react.Component);

NotificationComponent.defaultProps = {
    settings: {}
};
var Notification = exports.Notification = (0, _reactRedux.connect)(function (state) {
    return {
        ui: state.ui,
        settings: state.app.settings && state.app.settings.web
    };
}, function (dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)({
            hideSettingsNotification: _appStateActions.hideSettingsNotification,
            showSettings: _appStateActions.showSettings
        }, dispatch)
    };
})(NotificationComponent);