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
        var _props = this.props,
            color = _props.color,
            dark = _props.dark,
            style = _props.style;

        var innerCircleStyle = {};

        if (dark) {
            classNames.push('dark');
        }

        if (color) {
            innerCircleStyle.backgroundColor = '#' + this.props.color;
        }

        var circles = [];

        for (var i = 1; i < 13; i++) {
            circles.push(_react2.default.createElement(
                'div',
                { className: 'sk-circle' + i + ' sk-circle',
                    key: i },
                _react2.default.createElement('div', { className: 'sk-inner-circle',
                    style: innerCircleStyle })
            ));
        }

        return _react2.default.createElement(
            'div',
            { style: style,
                className: classNames.join(' ') },
            circles
        );
    };

    return LoadingComponent;
}(_react.Component);