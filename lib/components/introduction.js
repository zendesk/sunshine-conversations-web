'use strict';

exports.__esModule = true;
exports.Introduction = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactDom = require('react-dom');

var _alternateChannels = require('./alternate-channels');

var _html = require('../utils/html');

var _app = require('../utils/app');

var _defaultAppIcon = require('./default-app-icon');

var _appStateActions = require('../actions/app-state-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IntroductionComponent = function (_Component) {
    (0, _inherits3.default)(IntroductionComponent, _Component);

    function IntroductionComponent() {
        (0, _classCallCheck3.default)(this, IntroductionComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        _this._debounceHeightCalculation = (0, _lodash2.default)(_this.calculateIntroHeight.bind(_this), 150);
        return _this;
    }

    IntroductionComponent.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        setTimeout(function () {
            return _this2.calculateIntroHeight();
        });
        window.addEventListener('resize', this._debounceHeightCalculation);
    };

    IntroductionComponent.prototype.componentWillUpdate = function componentWillUpdate() {
        this._debounceHeightCalculation();
    };

    IntroductionComponent.prototype.componentWillUnmount = function componentWillUnmount() {
        window.removeEventListener('resize', this._debounceHeightCalculation);
    };

    IntroductionComponent.prototype.calculateIntroHeight = function calculateIntroHeight() {
        var node = (0, _reactDom.findDOMNode)(this);
        var introHeight = this.props.appState.introHeight;


        var nodeRect = node.getBoundingClientRect();
        var nodeHeight = Math.floor(nodeRect.height);

        if (introHeight !== nodeHeight) {
            this.props.dispatch((0, _appStateActions.setIntroHeight)(nodeHeight));
        }
    };

    IntroductionComponent.prototype.render = function render() {
        var _props = this.props;
        var app = _props.app;
        var integrations = _props.integrations;
        var _context = this.context;
        var text = _context.ui.text;
        var accentColor = _context.settings.accentColor;

        var channelDetailsList = (0, _app.getAppChannelDetails)(integrations);
        var channelsAvailable = channelDetailsList.length > 0;
        var introText = channelsAvailable ? text.introductionText + ' ' + text.introAppText : text.introductionText;

        return _react2.default.createElement(
            'div',
            { className: 'sk-intro-section' },
            app.iconUrl ? _react2.default.createElement('img', { className: 'app-icon',
                src: app.iconUrl }) : _react2.default.createElement(_defaultAppIcon.DefaultAppIcon, { color: accentColor }),
            _react2.default.createElement(
                'div',
                { className: 'app-name' },
                app.name || 'Smooch Technologies Inc.'
            ),
            _react2.default.createElement('div', { className: 'intro-text',
                dangerouslySetInnerHTML: (0, _html.createMarkup)(introText) }),
            channelsAvailable ? _react2.default.createElement(_alternateChannels.AlternateChannels, { items: channelDetailsList }) : null
        );
    };

    return IntroductionComponent;
}(_react.Component);

IntroductionComponent.propTypes = {
    app: _react.PropTypes.object.isRequired,
    integrations: _react.PropTypes.array.isRequired,
    dispatch: _react.PropTypes.func.isRequired
};
IntroductionComponent.contextTypes = {
    ui: _react.PropTypes.object,
    settings: _react.PropTypes.object
};
var Introduction = exports.Introduction = (0, _reactRedux.connect)(function (_ref) {
    var app = _ref.app;
    var introHeight = _ref.appState.introHeight;

    return {
        app: app,
        integrations: app.integrations,
        appState: {
            introHeight: introHeight
        }
    };
})(IntroductionComponent);