'use strict';

exports.__esModule = true;
exports.Header = exports.HeaderComponent = undefined;

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

var _appService = require('../services/app-service');

var _appStateActions = require('../actions/app-state-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HeaderComponent = exports.HeaderComponent = function (_Component) {
    (0, _inherits3.default)(HeaderComponent, _Component);

    function HeaderComponent(props) {
        (0, _classCallCheck3.default)(this, HeaderComponent);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.actions = _this.props.actions;

        _this.showSettings = _this.showSettings.bind(_this);
        _this.hideSettings = _this.hideSettings.bind(_this);
        return _this;
    }

    HeaderComponent.prototype.showSettings = function showSettings(e) {
        e.stopPropagation();
        this.actions.showSettings();
    };

    HeaderComponent.prototype.hideSettings = function hideSettings(e) {
        e.stopPropagation();
        this.actions.hideSettings();
    };

    HeaderComponent.prototype.render = function render() {
        var _props$appState = this.props.appState;
        var settingsEnabled = _props$appState.settingsEnabled;
        var settingsVisible = _props$appState.settingsVisible;
        var widgetOpened = _props$appState.widgetOpened;
        var embedded = _props$appState.embedded;
        var _props$ui$text = this.props.ui.text;
        var settingsHeaderText = _props$ui$text.settingsHeaderText;
        var headerText = _props$ui$text.headerText;


        var unreadMessagesCount = this.props.conversation.unreadCount;

        var unreadBadge = !settingsVisible && unreadMessagesCount > 0 ? _react2.default.createElement(
            'div',
            { id: 'sk-badge' },
            unreadMessagesCount
        ) : null;

        var settingsButton = widgetOpened && settingsEnabled && !settingsVisible ? _react2.default.createElement(
            'div',
            { id: 'sk-settings-handle', onClick: this.showSettings },
            _react2.default.createElement('i', { className: 'fa fa-gear' })
        ) : null;

        var backButton = widgetOpened && settingsEnabled && settingsVisible ? _react2.default.createElement(
            'div',
            { className: 'sk-back-handle', onClick: this.hideSettings },
            _react2.default.createElement('i', { className: 'fa fa-arrow-left' })
        ) : null;

        var closeHandle = null;
        if (!embedded) {
            closeHandle = widgetOpened ? _react2.default.createElement(
                'div',
                { className: 'sk-close-handle sk-close-hidden' },
                _react2.default.createElement('i', { className: 'fa fa-times' })
            ) : _react2.default.createElement(
                'div',
                { className: 'sk-show-handle sk-appear-hidden' },
                _react2.default.createElement('i', { className: 'fa fa-arrow-up' })
            );
        }

        var settingsTextStyle = {
            display: 'inline-block',
            height: 30,
            cursor: 'pointer'
        };

        var settingsText = _react2.default.createElement(
            'div',
            { style: settingsTextStyle, onClick: this.hideSettings },
            settingsHeaderText
        );
        var headerStyle = {};
        if (this.props.settings && this.props.settings.accentColor) {
            headerStyle.backgroundColor = '#' + this.props.settings.accentColor;
        }

        return _react2.default.createElement(
            'div',
            { id: settingsVisible ? 'sk-settings-header' : 'sk-header', style: headerStyle, onClick: !embedded && _appService.toggleWidget, className: 'sk-header-wrapper' },
            settingsButton,
            backButton,
            settingsVisible ? settingsText : headerText,
            unreadBadge,
            closeHandle
        );
    };

    return HeaderComponent;
}(_react.Component);

function mapStateToProps(state) {
    return {
        ui: state.ui,
        appState: state.appState,
        conversation: state.conversation,
        settings: state.app.settings.web
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)({
            showSettings: _appStateActions.showSettings,
            hideSettings: _appStateActions.hideSettings
        }, dispatch)
    };
}

var Header = exports.Header = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(HeaderComponent);