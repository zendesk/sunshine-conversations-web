'use strict';

exports.__esModule = true;
exports.ImageLoading = ImageLoading;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ImageLoading() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        color = _ref.color;

    var bounceStyle = {};

    if (color) {
        bounceStyle.backgroundColor = '#' + color;
    }

    return _react2.default.createElement(
        'div',
        { className: 'image-overlay' },
        _react2.default.createElement(
            'div',
            { className: 'three-bounce spinner' },
            _react2.default.createElement('div', { className: 'bounce1',
                style: bounceStyle }),
            _react2.default.createElement('div', { className: 'bounce2',
                style: bounceStyle }),
            _react2.default.createElement('div', { className: 'bounce3',
                style: bounceStyle })
        )
    );
}