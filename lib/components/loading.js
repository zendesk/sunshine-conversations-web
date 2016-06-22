'use strict';

exports.__esModule = true;
exports.LoadingComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoadingComponent = exports.LoadingComponent = function (_Component) {
    (0, _inherits3.default)(LoadingComponent, _Component);

    function LoadingComponent() {
        (0, _classCallCheck3.default)(this, LoadingComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    LoadingComponent.prototype.render = function render() {
        var classNames = ['sk-fading-circle'];
        if (this.props.dark) {
            classNames.push('dark');
        }

        return _react2.default.createElement(
            'div',
            { style: this.props.style, className: classNames.join(' ') },
            _react2.default.createElement('div', { className: 'sk-circle1 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle2 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle3 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle4 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle5 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle6 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle7 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle8 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle9 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle10 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle11 sk-circle' }),
            _react2.default.createElement('div', { className: 'sk-circle12 sk-circle' })
        );
    };

    return LoadingComponent;
}(_react.Component);