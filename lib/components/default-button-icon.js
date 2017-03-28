'use strict';

exports.__esModule = true;
exports.DefaultButtonIcon = exports.DefaultButtonIconComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _styles = require('../constants/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultButtonIconComponent = exports.DefaultButtonIconComponent = function (_Component) {
    (0, _inherits3.default)(DefaultButtonIconComponent, _Component);

    function DefaultButtonIconComponent() {
        (0, _classCallCheck3.default)(this, DefaultButtonIconComponent);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    DefaultButtonIconComponent.prototype.render = function render() {
        var _props = this.props,
            isBrandColorDark = _props.isBrandColorDark,
            location = _props.location;
        var protocol = location.protocol,
            host = location.host,
            pathname = location.pathname,
            search = location.search;


        return _react2.default.createElement(
            'svg',
            { version: '1.0',
                x: '0px',
                y: '0px',
                viewBox: '0 0 100 100',
                className: 'default-icon',
                style: { enableBackground: 'new 0 0 100 100', overflow: 'visible', shapeRendering: 'geometricPrecision' } },
            _react2.default.createElement(
                'filter',
                { id: '33c9df204aeec9aa096f1fd360bd4160' },
                _react2.default.createElement('feGaussianBlur', { stdDeviation: '0,4',
                    'in': 'SourceAlpha' }),
                _react2.default.createElement('feOffset', { dx: '0',
                    dy: '4',
                    result: 'offsetblur' }),
                _react2.default.createElement(
                    'feComponentTransfer',
                    null,
                    _react2.default.createElement('feFuncA', { type: 'linear',
                        slope: '0.4' })
                ),
                _react2.default.createElement('feComposite', { operator: 'in',
                    in2: 'offsetblur' }),
                _react2.default.createElement(
                    'feMerge',
                    null,
                    _react2.default.createElement('feMergeNode', null),
                    _react2.default.createElement('feMergeNode', { 'in': 'SourceGraphic' })
                )
            ),
            _react2.default.createElement('path', { fill: isBrandColorDark ? '#fff' : _styles.SK_DARK_CONTRAST,
                filter: 'url(' + protocol + '//' + host + pathname + search + '#33c9df204aeec9aa096f1fd360bd4160)',
                d: 'M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50h30.8l0-10.6C92.5,80.2,100,66,100,50C100,22.4,77.6,0,50,0z M32,54.5 c-2.5,0-4.5-2-4.5-4.5c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5C36.5,52.5,34.5,54.5,32,54.5z M50,54.5c-2.5,0-4.5-2-4.5-4.5 c0-2.5,2-4.5,4.5-4.5c2.5,0,4.5,2,4.5,4.5C54.5,52.5,52.5,54.5,50,54.5z M68,54.5c-2.5,0-4.5-2-4.5-4.5c0-2.5,2-4.5,4.5-4.5 s4.5,2,4.5,4.5C72.5,52.5,70.5,54.5,68,54.5z' })
        );
    };

    return DefaultButtonIconComponent;
}(_react.Component);

DefaultButtonIconComponent.propTypes = {
    isBrandColorDark: _react.PropTypes.bool.isRequired,
    location: _react.PropTypes.object.isRequired
};
var DefaultButtonIcon = exports.DefaultButtonIcon = (0, _reactRedux.connect)(function (_ref) {
    var currentLocation = _ref.browser.currentLocation;

    return {
        location: currentLocation
    };
})(DefaultButtonIconComponent);