'use strict';

exports.__esModule = true;
exports.Root = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _widget = require('./components/widget');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Root = exports.Root = function (_Component) {
    (0, _inherits3.default)(Root, _Component);

    function Root() {
        (0, _classCallCheck3.default)(this, Root);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    Root.prototype.render = function render() {
        var store = this.props.store;

        return _react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(_widget.Widget, null)
        );
    };

    return Root;
}(_react.Component);