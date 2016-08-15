'use strict';

exports.__esModule = true;
exports.ImageUpload = undefined;

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _conversationService = require('../services/conversation-service');

var _events = require('../utils/events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageUpload = exports.ImageUpload = function (_Component) {
    (0, _inherits3.default)(ImageUpload, _Component);

    function ImageUpload() {
        (0, _classCallCheck3.default)(this, ImageUpload);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        _this.state = {
            imageButtonHovered: false
        };

        _this.onImageChange = _this.onImageChange.bind(_this);
        return _this;
    }

    ImageUpload.prototype.onImageChange = function onImageChange(e) {
        var _this2 = this;

        e.preventDefault();
        var files = this.refs.fileInput.files;
        // we only allow one file in the input, but let's handle it
        // as if we supported multiple ones
        return _promise2.default.all((0, _from2.default)(files).map(function (file) {
            // catch it to prevent an unhandled promise exception
            return (0, _conversationService.uploadImage)(file).catch(function () {});
        })).then(function () {
            // if the file input is not reset, a user can't pick the same
            // file twice in a row.
            _this2.refs.imageUploadForm.reset();
        });
    };

    ImageUpload.prototype.onMouseOver = function onMouseOver() {
        this.setState({
            imageButtonHovered: true
        });
    };

    ImageUpload.prototype.onMouseOut = function onMouseOut() {
        this.setState({
            imageButtonHovered: false
        });
    };

    ImageUpload.prototype.render = function render() {
        var _this3 = this;

        var style = {};

        if (this.props.color && this.state.imageButtonHovered) {
            style.color = '#' + this.props.color;
        }
        return _react2.default.createElement(
            'label',
            { className: 'btn btn-sk-link image-upload',
                onMouseOver: function onMouseOver() {
                    return _this3.onMouseOver();
                },
                onMouseOut: function onMouseOut() {
                    return _this3.onMouseOut();
                },
                style: style },
            _react2.default.createElement(
                'form',
                { ref: 'imageUploadForm',
                    onSubmit: _events.preventDefault },
                _react2.default.createElement('input', { type: 'file',
                    accept: 'image/*',
                    onChange: this.onImageChange,
                    ref: 'fileInput' })
            ),
            _react2.default.createElement('i', { className: 'fa fa-camera' })
        );
    };

    return ImageUpload;
}(_react.Component);