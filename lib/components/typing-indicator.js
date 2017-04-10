'use strict';

exports.__esModule = true;
exports.TypingIndicator = exports.TypingIndicatorComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TypingIndicatorComponent = exports.TypingIndicatorComponent = function (_Component) {
    (0, _inherits3.default)(TypingIndicatorComponent, _Component);

    function TypingIndicatorComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, TypingIndicatorComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
            mounted: false
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    TypingIndicatorComponent.prototype.componentDidMount = function componentDidMount() {
        this.setState({
            mounted: true
        });
    };

    TypingIndicatorComponent.prototype.render = function render() {
        var _props = this.props,
            avatarUrl = _props.avatarUrl,
            name = _props.name,
            firstInGroup = _props.firstInGroup;
        var mounted = this.state.mounted;


        var avatar = avatarUrl ? _react2.default.createElement('img', { src: avatarUrl,
            alt: name + '\'s avatar',
            className: 'sk-typing-indicator-avatar' }) : _react2.default.createElement('div', { className: 'sk-typing-indicator-avatar-placeholder' });

        var fromName = name && firstInGroup ? _react2.default.createElement(
            'div',
            { className: 'sk-from' },
            name
        ) : null;

        return _react2.default.createElement(
            'div',
            { className: 'sk-typing-indicator-container ' + (mounted ? 'fade-in' : '') },
            fromName,
            avatar,
            _react2.default.createElement(
                'div',
                { className: 'sk-typing-indicator ' + (firstInGroup ? 'sk-typing-indicator-first' : '') },
                _react2.default.createElement('span', null),
                _react2.default.createElement('span', null),
                _react2.default.createElement('span', null)
            )
        );
    };

    return TypingIndicatorComponent;
}(_react.Component);

TypingIndicatorComponent.propTypes = {
    avatarUrl: _react.PropTypes.string,
    name: _react.PropTypes.string,
    firstInGroup: _react.PropTypes.bool
};
TypingIndicatorComponent.defaultProps = {
    firstInGroup: true
};
var TypingIndicator = exports.TypingIndicator = (0, _reactRedux.connect)(function (_ref) {
    var appState = _ref.appState;

    return {
        avatarUrl: appState.typingIndicatorAvatarUrl,
        name: appState.typingIndicatorName
    };
})(TypingIndicatorComponent);