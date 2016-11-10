'use strict';

exports.__esModule = true;
exports.DefaultAppIcon = exports.DefaultAppIconComponent = undefined;

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

var DefaultAppIconComponent = exports.DefaultAppIconComponent = function (_Component) {
      (0, _inherits3.default)(DefaultAppIconComponent, _Component);

      function DefaultAppIconComponent() {
            (0, _classCallCheck3.default)(this, DefaultAppIconComponent);
            return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
      }

      DefaultAppIconComponent.prototype.render = function render() {
            var _props$settings = this.props.settings,
                brandColor = _props$settings.brandColor,
                isBrandColorDark = _props$settings.isBrandColorDark;

            var backgroundFill = '#' + brandColor;
            var businessPathFill = isBrandColorDark ? 'transparent' : _styles.SK_DARK_CONTRAST;

            return _react2.default.createElement(
                  'svg',
                  { className: 'app-icon',
                        viewBox: '0 0 80 80',
                        style: { enableBackground: 'new 0 0 80 80', shapeRendering: 'geometricPrecision' } },
                  _react2.default.createElement('rect', { fill: backgroundFill,
                        x: '31.3',
                        y: '39.5',
                        width: '4.4',
                        height: '4.4' }),
                  _react2.default.createElement('rect', { fill: backgroundFill,
                        x: '31.3',
                        y: '30.8',
                        width: '4.4',
                        height: '5.8' }),
                  _react2.default.createElement('path', { fill: backgroundFill,
                        d: 'M48.7,52.6v-5.8h-4.4v33c3-0.3,5.9-1,8.7-2V52.6H48.7z' }),
                  _react2.default.createElement('path', { fill: backgroundFill,
                        d: 'M56,64.2v12.5c2-0.9,4-1.9,5.8-3.1v-9.3H56z' }),
                  _react2.default.createElement('path', { fill: backgroundFill,
                        d: 'M18.2,64.2v9.3c1.8,1.2,3.8,2.3,5.8,3.2V64.2H18.2z' }),
                  _react2.default.createElement('path', { fill: backgroundFill,
                        d: 'M38.5,46.8V80c0.5,0,1,0,1.5,0s1,0,1.5,0V46.8H38.5z' }),
                  _react2.default.createElement('path', { fill: backgroundFill,
                        d: 'M31.3,46.8v5.8h-4.4v25.2c2.8,1,5.8,1.7,8.7,2v-33L31.3,46.8L31.3,46.8z' }),
                  _react2.default.createElement('rect', { fill: backgroundFill,
                        x: '44.4',
                        y: '30.8',
                        width: '4.4',
                        height: '5.8' }),
                  _react2.default.createElement('rect', { fill: backgroundFill,
                        x: '38.5',
                        y: '39.5',
                        width: '2.9',
                        height: '4.4' }),
                  _react2.default.createElement('path', { fill: backgroundFill,
                        d: 'M80,40C80,17.9,62.1,0,40,0S0,17.9,0,40c0,12.3,5.6,23.9,15.3,31.4V59.7c0-0.7,0.6-1.3,1.3-1.3h0h4.5V51 c0-0.7,0.6-1.3,1.3-1.3h4.5V26.3c0-0.7,0.6-1.3,1.3-1.3h7.4V19c0-0.7,0.6-1.3,1.3-1.3c0,0,0,0,0.1,0h1.6V7.5C38.6,6.7,39.2,6,40,6 c0.8,0,1.5,0.7,1.5,1.5v10.2H43c0.7,0,1.3,0.6,1.4,1.3c0,0,0,0,0,0v6h7.4c0.7,0,1.3,0.6,1.3,1.3v0v23.4h4.8c0.7,0,1.3,0.6,1.3,1.3 v7.6h4.2c0.7,0,1.3,0.6,1.3,1.3v0v11.5C74.4,63.9,80,52.3,80,40z' }),
                  _react2.default.createElement('rect', { fill: backgroundFill,
                        x: '38.5',
                        y: '30.8',
                        width: '2.9',
                        height: '5.8' }),
                  _react2.default.createElement('rect', { fill: backgroundFill,
                        x: '44.4',
                        y: '39.5',
                        width: '4.4',
                        height: '4.4' }),
                  _react2.default.createElement(
                        'g',
                        null,
                        _react2.default.createElement('path', { fill: businessPathFill,
                              d: 'M56,76.7V64.2h5.8v9.3c1-0.7,2-1.3,2.9-2.1V60c0-0.7-0.6-1.3-1.3-1.3h-4.2V51c0-0.7-0.6-1.3-1.3-1.3h-4.8V26.3 v0c0-0.7-0.6-1.3-1.3-1.3h-7.4v-6c0,0,0,0,0,0c0-0.7-0.6-1.3-1.4-1.3h-1.5V7.5c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v10.2H37 c0,0,0,0-0.1,0c-0.7,0-1.3,0.6-1.3,1.3V25h-7.4c-0.7,0-1.3,0.6-1.3,1.3v23.4h-4.5c-0.7,0-1.3,0.6-1.3,1.3v7.4h-4.5 c-0.7,0-1.3,0.6-1.3,1.3v11.7c0.9,0.7,1.9,1.4,2.9,2.1v-9.3H24v12.4c1,0.4,1.9,0.8,2.9,1.1V52.6h4.4v-5.8h4.4v33 c1,0.1,1.9,0.2,2.9,0.2V46.8h2.9V80c1,0,1.9-0.1,2.9-0.2v-33h4.4v5.8h4.4v25.2 M35.6,43.9h-4.4v-4.4h4.4V43.9z M35.6,36.6h-4.4 v-5.8h4.4V36.6z M41.5,43.9h-2.9v-4.4h2.9V43.9z M41.5,36.6h-2.9v-5.8h2.9V36.6z M48.7,43.9h-4.4v-4.4h4.4V43.9z M48.7,36.6h-4.4 v-5.8h4.4V36.6z' }),
                        _react2.default.createElement('path', { fill: businessPathFill,
                              d: 'M56.1,76.6C56.1,76.7,56,76.7,56.1,76.6L56.1,76.6C56,76.7,56.1,76.7,56.1,76.6z' }),
                        _react2.default.createElement('path', { fill: businessPathFill,
                              d: 'M18.2,73.6C18.2,73.6,18.2,73.6,18.2,73.6L18.2,73.6C18.2,73.6,18.2,73.6,18.2,73.6z' })
                  )
            );
      };

      return DefaultAppIconComponent;
}(_react.Component);

DefaultAppIconComponent.propTypes = {
      settings: _react.PropTypes.object.isRequired
};
var DefaultAppIcon = exports.DefaultAppIcon = (0, _reactRedux.connect)(function (_ref) {
      var app = _ref.app;

      return {
            settings: app.settings.web
      };
})(DefaultAppIconComponent);