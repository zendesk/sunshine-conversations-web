'use strict';

exports.__esModule = true;
exports.Location = exports.LocationIconComponent = undefined;

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

var LocationIconComponent = exports.LocationIconComponent = function (_Component) {
    (0, _inherits3.default)(LocationIconComponent, _Component);

    function LocationIconComponent() {
        (0, _classCallCheck3.default)(this, LocationIconComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    LocationIconComponent.prototype.render = function render() {
        var accentColor = this.props.settings.accentColor;

        var backgroundFill = '#' + accentColor;

        return _react2.default.createElement(
            'svg',
            { className: 'sk-location-icon',
                fill: backgroundFill,
                viewBox: '0 0 127.9 127.9' },
            _react2.default.createElement(
                'g',
                null,
                _react2.default.createElement('ellipse', { 'class': 'st0',
                    cx: '64',
                    cy: '58.9',
                    rx: '12',
                    ry: '11.9' }),
                _react2.default.createElement('path', { 'class': 'st0',
                    d: 'M64,0.5C28.9,0.5,0.5,28.9,0.5,64c0,35,28.4,63.5,63.5,63.5c35,0,63.5-28.4,63.5-63.5 C127.4,28.9,99,0.5,64,0.5z M67.9,99.9c-2.2,2.4-5.9,2.4-8.1,0.2C48.1,88.2,35.2,73.5,35.2,59.5c0-15.8,12.9-28.6,28.8-28.6 c15.9,0,28.8,12.8,28.8,28.6C92.9,73.4,78.6,88.2,67.9,99.9z' })
            )
        );
    };

    return LocationIconComponent;
}(_react.Component);

LocationIconComponent.propTypes = {
    settings: _react.PropTypes.object.isRequired
};
var Location = exports.Location = (0, _reactRedux.connect)(function (_ref) {
    var app = _ref.app;

    return {
        settings: app.settings.web
    };
})(LocationIconComponent);