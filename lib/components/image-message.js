'use strict';

exports.__esModule = true;
exports.ImageMessage = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactImageloader = require('react-imageloader');

var _reactImageloader2 = _interopRequireDefault(_reactImageloader);

var _imageLoading = require('./image-loading');

var _message = require('../constants/message');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageMessage = exports.ImageMessage = function (_Component) {
    (0, _inherits3.default)(ImageMessage, _Component);

    function ImageMessage() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, ImageMessage);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {}, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    ImageMessage.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (this.props.mediaUrl !== nextProps.mediaUrl) {
            // keep the old url so we can display it while the new one loads from
            // the CDN.
            this.setState({
                oldMediaUrl: this.props.mediaUrl
            });
        }
    };

    ImageMessage.prototype.render = function render() {
        var _this2 = this;

        var preloader = function preloader() {
            return _react2.default.createElement(
                'div',
                { className: 'preloader-container' },
                _react2.default.createElement(_imageLoading.ImageLoading, { color: _this2.props.accentColor }),
                _this2.state.oldMediaUrl ? _react2.default.createElement('img', { src: _this2.state.oldMediaUrl,
                    alt: 'Uploaded image' }) : null
            );
        };
        var image = _react2.default.createElement(_reactImageloader2.default, { src: this.props.mediaUrl,
            imgProps: { alt: 'Uploaded image' },
            wrapper: _react2.default.DOM.div,
            preloader: preloader,
            onLoad: this.props.onLoad });

        if (this.props.sendStatus === _message.SEND_STATUS.SENDING) {
            return _react2.default.createElement(
                'div',
                { className: 'image-container' },
                _react2.default.createElement(_imageLoading.ImageLoading, { color: this.props.accentColor }),
                image
            );
        }

        return image;
    };

    return ImageMessage;
}(_react.Component);

ImageMessage.propTypes = {
    mediaUrl: _react2.default.PropTypes.string.isRequired,
    accentColor: _react2.default.PropTypes.string
};